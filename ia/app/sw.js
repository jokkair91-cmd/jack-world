// AI JACK : garde l'appli en mémoire pour qu'elle s'installe et s'ouvre aussi sans connexion.
// Réseau d'abord : en ligne, on reçoit toujours la dernière version ; hors ligne, la dernière copie gardée.
// On garde aussi le moteur WebLLM (cdn.jsdelivr.net). Le cerveau de Jack (le modèle, environ 1 Go)
// est gardé par WebLLM lui-même dans le navigateur, pas ici.
const CACHE = 'jackworld-ia-app-2026-11-22';
const DEPART = ['index.html', 'style.css', 'app.js', 'manifest.webmanifest', 'icon-192.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(DEPART)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('jackworld-ia-app-') && key !== CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  const moteur = url.origin === 'https://cdn.jsdelivr.net' && url.pathname.startsWith('/npm/@mlc-ai/web-llm@');
  if (req.method !== 'GET' || req.headers.has('range') || (url.origin !== location.origin && !moteur)) return;
  event.respondWith(fetch(req).then(response => {
    if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
      const copie = response.clone();
      caches.open(CACHE).then(cache => cache.put(req, copie));
    }
    return response;
  }).catch(() => caches.match(req, { ignoreSearch: !moteur }).then(r => r || (req.mode === 'navigate' ? caches.match(DEPART[0]) : undefined))));
});
