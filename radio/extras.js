// Jack 22 Radio — ajouts : écran verrouillé, partage, lien direct, radio de secours, appli installable.
const ICON_SRC = 'icon-192.png';
function showAllDestinations() {
  activeCountry = 'all';
  document.querySelectorAll('[data-country]').forEach(button => button.classList.toggle('active', button.dataset.country === 'all'));
}

// 1. Commandes sur l'écran verrouillé, les écouteurs et les touches multimédia.
if ('mediaSession' in navigator) {
  const artwork = [{src: new URL(ICON_SRC, location.href).href, sizes: '192x192', type: 'image/png'}];
  const syncMedia = () => {
    const station = stations[playingId || current];
    try {
      navigator.mediaSession.metadata = new MediaMetadata({title: station.name, artist: 'Jack 22 Radio · La fréquence du bloc', album: station.type, artwork});
      navigator.mediaSession.playbackState = audio.paused ? 'paused' : 'playing';
    } catch {}
  };
  const hop = direction => {
    const wasPlaying = !audio.paused;
    rotate(direction);
    if (!wasPlaying) startStation();
  };
  const handlers = {
    play: () => { if (!playingId) startStation(); else audio.play().catch(() => startStation()); },
    pause: () => audio.pause(),
    stop: () => audio.pause(),
    nexttrack: () => hop(1),
    previoustrack: () => hop(-1)
  };
  for (const [action, handler] of Object.entries(handlers)) {
    try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
  }
  audio.addEventListener('playing', syncMedia);
  audio.addEventListener('pause', syncMedia);
}

// 2. Partager la radio choisie (WhatsApp, Snap…) avec un lien qui l'ouvre directement.
function radioLink(id) {
  return location.href.split('#')[0] + '#radio=' + id;
}
async function shareRadio() {
  const id = playingId || current;
  const station = stations[id];
  const url = radioLink(id);
  const text = `J'écoute ${station.name} sur Jack 22 Radio — La fréquence du bloc`;
  if (navigator.share) {
    try { await navigator.share({title: 'Jack 22 Radio', text, url}); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(text + ' ' + url);
    availability.textContent = 'Lien copié. Colle-le dans WhatsApp, Snap ou un SMS.';
  } catch {
    availability.textContent = 'Copie ce lien pour partager : ' + url;
  }
}
const shareButton = document.createElement('button');
shareButton.id = 'shareRadio';
shareButton.className = 'favorite-radio';
shareButton.textContent = '↗ Partager cette radio';
shareButton.onclick = shareRadio;
document.querySelector('#favoriteRadio').after(shareButton);
const immersiveShare = document.createElement('button');
immersiveShare.id = 'immersiveShare';
immersiveShare.textContent = '↗ Partager';
immersiveShare.onclick = shareRadio;
document.querySelector('.immersive-actions').append(immersiveShare);

function openFromLink() {
  const match = location.hash.match(/radio=([\w-]+)/);
  if (!match || !stations[match[1]]) return;
  clearDiscoveryFilters();
  showAllDestinations();
  selectStation(match[1], false);
  setView('listen');
  availability.textContent = `${stations[match[1]].name} t'attend. Appuie sur ÉCOUTER.`;
}
openFromLink();
window.addEventListener('hashchange', openFromLink);

// 3. Radio de secours : si un flux ne répond pas, on bascule tout seul sur une radio proche.
const MAX_AUTO_SWITCH = 3;
const autoTried = new Set();
let autoSwitches = 0;
let handledRequest = -1;
const showFailure = playbackFailure;
playbackFailure = function (id, request) {
  // Une même panne peut être signalée deux fois (erreur du flux + échec de lecture) : on ne la traite qu'une fois.
  if (request !== attempt || request === handledRequest) return;
  handledRequest = request;
  showFailure(id, request);
  autoTried.add(id);
  if (autoSwitches >= MAX_AUTO_SWITCH) {
    availability.textContent = 'Plusieurs radios ne répondent pas. Vérifie ta connexion, puis réessaie.';
    autoSwitches = 0;
    autoTried.clear();
    return;
  }
  const failed = stations[id];
  const pool = Object.keys(stations).filter(other => !autoTried.has(other) && extraFilter(other));
  const sameStyle = pool.filter(other => stations[other].genres.some(genre => failed.genres.includes(genre)));
  const sameStyleNearby = sameStyle.filter(other => stations[other].country === failed.country);
  const nearby = pool.filter(other => stations[other].country === failed.country);
  const list = sameStyleNearby.length ? sameStyleNearby : sameStyle.length ? sameStyle : nearby;
  if (!list.length) return;
  const next = list[Math.floor(Math.random() * list.length)];
  autoSwitches++;
  availability.textContent = `${failed.name} ne répond pas · on passe sur ${stations[next].name}…`;
  setTimeout(() => {
    if (request !== attempt) return;
    showAllDestinations();
    selectStation(next, true);
  }, 1500);
};
audio.addEventListener('playing', () => { autoSwitches = 0; autoTried.clear(); });

// 4. Appli installable (fonctionne une fois le site en ligne, pas en fichier local).
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
