const stage = document.querySelector('.stage');
const jackWelcome = document.querySelector('#jackWelcome');
const explorer = document.querySelector('.wheel-section');
const appNav = document.createElement('nav');
appNav.className = 'app-nav';
appNav.setAttribute('aria-label', 'Navigation radio');
appNav.innerHTML = '<button data-view="listen" aria-pressed="true">Écouter</button><button data-view="explore" aria-pressed="false">Explorer</button><button data-view="favorites" aria-pressed="false">Favoris</button>';
stage.before(appNav);
const immersive = document.createElement('div');
immersive.className = 'immersive-player';
immersive.innerHTML = '<div class="immersive-badge" aria-hidden="true"></div><p class="eyebrow">JACK RADIO</p><h1 id="immersiveName"></h1><p id="immersiveStyle"></p><div class="immersive-actions"><button id="immersivePlay">▶ Écouter</button><button id="immersiveFavorite">♡ Favori</button><button id="changeStation">Changer de radio</button></div><p id="immersiveStatus" role="status">Prêt à écouter</p>';
stage.append(immersive);
const preferences = document.createElement('div');
preferences.className = 'listening-options';
preferences.innerHTML = '<button id="fullScreen">Plein écran</button><label>Ambiance<select id="ambience"><option value="festive">Festive</option><option value="calm">Discrète</option></select></label><label>Arrêt automatique<select id="sleepTimer"><option value="0">Désactivé</option><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option></select></label><span id="timerStatus" role="status"></span>';
stage.after(preferences);
const historyPanel = document.createElement('section');
historyPanel.className = 'recent-panel';
historyPanel.innerHTML = '<h2>Dernières écoutes</h2><div id="recentStations"></div>';
preferences.after(historyPanel);
let historyIds = [];
function savePreference(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function readPreference(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
const savedHistory = readPreference('jack-recent', []);
if (Array.isArray(savedHistory)) historyIds = savedHistory.filter(id => stations[id]).slice(0,8);
const savedVolume = readPreference('jack-volume', .8);
if (typeof savedVolume === 'number' && savedVolume >= 0 && savedVolume <= 1) {
  audio.volume = savedVolume;
  document.querySelector('#radioVolume').value = savedVolume;
}
audio.addEventListener('volumechange', () => savePreference('jack-volume', audio.volume));
let currentView = 'listen';
function setView(view) {
  currentView = view;
  document.body.dataset.view = view;
  jackWelcome.hidden = view !== 'home';
  stage.hidden = view !== 'listen';
  preferences.hidden = view !== 'listen';
  historyPanel.hidden = view !== 'listen';
  explorer.hidden = view === 'listen' || view === 'home';
  appNav.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  if (view === 'explore' || view === 'favorites') {
    favoritesOnly = view === 'favorites';
    if (favoritesOnly) {
      search.value = '';
      style.value = '';
      activeCountry = 'all';
      document.querySelectorAll('[data-country]').forEach(button => button.classList.toggle('active',button.dataset.country === 'all'));
    }
    document.querySelector('#favoritesOnly').setAttribute('aria-pressed', String(favoritesOnly));
    applyFilters();
  }
  syncImmersive();
}
appNav.querySelectorAll('button').forEach(button => button.onclick = () => setView(button.dataset.view));
document.querySelector('#changeStation').onclick = () => setView('explore');
function syncImmersive() {
  const id = playingId || current;
  const station = stations[id];
  document.querySelector('#immersiveName').textContent = station.name;
  document.querySelector('#immersiveStyle').textContent = station.meta;
  const badge = immersive.querySelector('.immersive-badge');
  badge.dataset.station = id;
  const animal = animalPaths[station.zone];
  badge.innerHTML = '<span class="station-art">' + (animal ? '<svg viewBox="0 0 64 64"><path fill="currentColor" fill-rule="evenodd" d="' + animal + '"/></svg>' : '<b>' + escapeHTML(station.mark) + '</b>') + '</span>';
  document.querySelector('#immersivePlay').textContent = audio.paused ? '▶ Écouter' : '❚❚ Pause';
  document.querySelector('#immersiveFavorite').textContent = favorites.has(id) ? '♥ Favori' : '♡ Favori';
  document.querySelector('#immersiveFavorite').setAttribute('aria-pressed', String(favorites.has(id)));
  document.querySelector('#immersiveStatus').textContent = document.querySelector('#dockStatus').textContent;
}
document.querySelector('#immersivePlay').onclick = () => document.querySelector('#dockPlay').click();
document.querySelector('#immersiveFavorite').onclick = () => {
  const id = playingId || current;
  if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
  savePreference('jack-radio-favorites', [...favorites]);
  refreshFavorites();
  syncImmersive();
};
new MutationObserver(syncImmersive).observe(document.querySelector('#dockStatus'), {childList:true});
new MutationObserver(syncImmersive).observe(selectedName, {childList:true});
function renderHistory() {
  const container = document.querySelector('#recentStations');
  container.replaceChildren();
  if (!historyIds.length) container.textContent = 'Tes prochaines écoutes apparaîtront ici.';
  historyIds.forEach(id => {
    const button = document.createElement('button');
    button.textContent = stations[id].name;
    button.onclick = () => {
      activeCountry = 'all';
      favoritesOnly = false;
      search.value = '';
      style.value = '';
      selectStation(id, true);
      setView('listen');
    };
    container.append(button);
  });
}
audio.addEventListener('playing', () => {
  if (playingId) {
    historyIds = [playingId, ...historyIds.filter(id => id !== playingId)].slice(0,8);
    savePreference('jack-recent', historyIds);
    renderHistory();
  }
  syncImmersive();
});
audio.addEventListener('pause', syncImmersive);
const ambience = document.querySelector('#ambience');
ambience.value = readPreference('jack-ambience','festive') === 'calm' ? 'calm' : 'festive';
function applyAmbience() {
  document.body.dataset.ambience = ambience.value;
  savePreference('jack-ambience', ambience.value);
}
ambience.onchange = applyAmbience;
applyAmbience();
document.querySelector('#fullScreen').onclick = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { document.querySelector('#timerStatus').textContent = 'Plein écran indisponible dans ce navigateur.'; }
};
document.addEventListener('fullscreenchange', () => {
  document.querySelector('#fullScreen').textContent = document.fullscreenElement ? 'Quitter le plein écran' : 'Plein écran';
});
let timerInterval;
let deadline = 0;
document.querySelector('#sleepTimer').onchange = event => {
  clearInterval(timerInterval);
  const minutes = Number(event.target.value);
  deadline = minutes ? Date.now() + minutes * 60000 : 0;
  function tick() {
    if (!deadline) { document.querySelector('#timerStatus').textContent = ''; return; }
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      ++attempt;
      clearTimeout(connectionTimer);
      audio.pause();
      clearInterval(timerInterval);
      deadline = 0;
      document.querySelector('#sleepTimer').value = '0';
      document.querySelector('#timerStatus').textContent = 'Minuterie terminée · musique arrêtée';
    } else document.querySelector('#timerStatus').textContent = 'Arrêt dans ' + Math.ceil(remaining / 60000) + ' min';
  }
  tick();
  if (deadline) timerInterval = setInterval(tick,1000);
};
renderHistory();
const headerBrand = document.querySelector('.topbar .brand');
const headerLogo = document.createElement('img');
headerLogo.src = document.querySelector('#jackWelcome img').src;
headerLogo.alt = '';
headerLogo.className = 'header-cassette';
headerBrand.prepend(headerLogo);
headerBrand.setAttribute('aria-label','Jack 22 — revenir à l’accueil');
headerBrand.addEventListener('click', event => {
  event.preventDefault();
  setView('home');
  window.scrollTo({top:0, behavior:'smooth'});
});
document.querySelector('#enterRadio').onclick = () => {
  setView('explore');
  appNav.scrollIntoView({behavior:'smooth', block:'start'});
};
setView('home');
