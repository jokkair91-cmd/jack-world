const controls = document.createElement('div');
controls.className = 'discovery-tools';
controls.innerHTML = '<label>Rechercher<input id="searchRadio" type="search" placeholder="Radio, pays, style…"></label><label>Style<select id="musicStyle"><option value="">Tous les sons</option><option value="rap">Rap / Hip-hop</option><option value="r&b">R&B</option><option value="grime">Grime UK</option><option value="shatta">Shatta</option><option value="dancehall">Dancehall</option><option value="afro">Afro / Urbain</option><option value="reggaeton">Reggaeton</option></select></label><button id="favoritesOnly" aria-pressed="false">♡ Mes favoris</button><button id="surpriseRadio">Surprends-moi</button><button id="resetFilters">Tout afficher</button>';
document.querySelector('.country-tabs').after(controls);
const favoriteButton = document.createElement('button');
favoriteButton.id = 'favoriteRadio';
favoriteButton.className = 'favorite-radio';
document.querySelector('.selected-station').after(favoriteButton);
const dock = document.createElement('aside');
dock.className = 'player-dock';
dock.setAttribute('aria-label', 'Lecteur radio');
dock.innerHTML = '<span id="dockLogo"></span><div><strong id="dockName">Choisis une radio</strong><small id="dockStatus">Prêt à écouter</small></div><button id="dockPlay" aria-label="Lecture ou pause">▶</button><label>Volume<input id="radioVolume" type="range" min="0" max="1" step=".01" value=".8"></label>';
document.body.append(dock);
const recovery = document.createElement('div');
recovery.className = 'recovery';
recovery.hidden = true;
recovery.innerHTML = '<button id="retryRadio">Réessayer</button><button id="similarRadio">Écouter une radio proche</button>';
availability.after(recovery);
let favorites = new Set();
try {
  const saved = JSON.parse(localStorage.getItem('jack-radio-favorites') || '[]');
  if (Array.isArray(saved)) favorites = new Set(saved.filter(id => stations[id]));
} catch {}
let favoritesOnly = false;
let playingId = null;
let attempt = 0;
let connectionTimer;
const search = document.querySelector('#searchRadio');
const style = document.querySelector('#musicStyle');
const programControl = document.createElement('label');
programControl.className = 'program-control';
programControl.innerHTML = 'Programme de cette radio <select id="radioProgram" aria-label="Programme de cette radio"></select>';
document.querySelector('.selected-station').after(programControl);
const programSelect = document.querySelector('#radioProgram');
function refreshPrograms() {
  const family = stations[current].family;
  const options = matchingIds().filter(id => family ? stations[id].family === family : id === current);
  programControl.hidden = options.length < 2;
  programSelect.innerHTML = options.map(id => `<option value="${id}">${escapeHTML(stations[id].name)}</option>`).join('');
  programSelect.value = current;
}
programSelect.onchange = () => selectStation(programSelect.value, !audio.paused);
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
extraFilter = id => {
  const station = stations[id];
  const text = normalize(station.name + ' ' + station.meta + ' ' + station.type);
  const genre = style.value;
  const matchesGenre = !genre || station.genres.includes(genre);
  return (!favoritesOnly || favorites.has(id)) && text.includes(normalize(search.value)) && matchesGenre;
};
function refreshFavorites() {
  favoriteButton.textContent = favorites.has(current) ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris';
  favoriteButton.setAttribute('aria-pressed', String(favorites.has(current)));
}
function applyFilters() {
  const visible = ids();
  if (visible.length && !visible.includes(current)) current = visible[0];
  updateSelection();
  refreshFavorites();
}
favoriteButton.onclick = () => {
  if (favorites.has(current)) favorites.delete(current); else favorites.add(current);
  try { localStorage.setItem('jack-radio-favorites', JSON.stringify([...favorites])); }
  catch { availability.textContent = 'Favoris conservés pour cette session uniquement.'; }
  applyFilters();
};
document.querySelector('#favoritesOnly').onclick = event => {
  favoritesOnly = !favoritesOnly;
  event.currentTarget.setAttribute('aria-pressed', String(favoritesOnly));
  applyFilters();
};
search.oninput = applyFilters;
style.querySelector('[value="grime"]').textContent = 'Rap UK / Grime';
style.querySelector('[value="afro"]').textContent = 'Afrobeat / Afropop';
const genreHint = document.createElement('p');
genreHint.className = 'genre-hint';
genreHint.setAttribute('role', 'status');
controls.after(genreHint);
function refreshGenreHint() {
  genreHint.textContent = style.value
    ? `${ids().length} radio(s) · ${style.selectedOptions[0].textContent}. Le style décrit la programmation musicale ; les émissions peuvent varier.`
    : 'Choisis ton style. Les radios généralistes restent dans Tous les sons.';
}
style.onchange = () => {
  // A genre opens across all destinations rather than leaving a hidden country restriction.
  activeCountry = 'all';
  document.querySelectorAll('[data-country]').forEach(button => button.classList.toggle('active', button.dataset.country === 'all'));
  const wasPlaying = !audio.paused;
  applyFilters();
  refreshGenreHint();
  if (playingId && !ids().includes(playingId)) {
    ++attempt;
    clearTimeout(connectionTimer);
    audio.pause();
    playingId = null;
    syncDock();
    if (wasPlaying && ids().length) startStation();
  }
};
new MutationObserver(refreshGenreHint).observe(stationCount, {childList:true});
refreshGenreHint();
function clearDiscoveryFilters() {
  search.value = '';
  style.value = '';
  favoritesOnly = false;
  document.querySelector('#favoritesOnly').setAttribute('aria-pressed', 'false');
}
document.querySelector('#resetFilters').textContent = 'Toutes les radios';
document.querySelector('#resetFilters').onclick = () => {
  clearDiscoveryFilters();
  document.querySelector('[data-country="all"]').click();
};
document.querySelector('#surpriseRadio').onclick = () => {
  const candidates = ids().filter(id => id !== current);
  const list = candidates.length ? candidates : ids();
  if (!list.length) return;
  selectStation(list[Math.floor(Math.random() * list.length)], true);
};
new MutationObserver(refreshFavorites).observe(selectedName, {childList:true});
audio.volume = .8;
document.querySelector('#radioVolume').oninput = event => { audio.volume = Number(event.target.value); };
function syncDock() {
  const id = playingId || current;
  document.querySelector('#dockName').textContent = stations[id].name;
  document.querySelector('#dockLogo').textContent = stations[id].mark;
  document.querySelector('#dockPlay').textContent = audio.paused ? '▶' : '❚❚';
}
function playbackFailure(id, request) {
  if (request !== attempt) return;
  clearTimeout(connectionTimer);
  audio.pause();
  availability.textContent = stations[id].name + ' ne répond pas. Réessaie ou choisis une autre radio.';
  document.querySelector('#dockStatus').textContent = 'Flux indisponible';
  recovery.hidden = false;
}
startStation = function () {
  if (!ids().includes(current)) {
    availability.textContent = 'Aucune radio dans cette sélection. Modifie tes filtres.';
    return;
  }
  const id = current;
  const request = ++attempt;
  clearTimeout(connectionTimer);
  playingId = id;
  recovery.hidden = true;
  audio.src = stations[id].stream;
  availability.textContent = 'Connexion à ' + stations[id].name + '…';
  document.querySelector('#dockStatus').textContent = 'Connexion…';
  syncDock();
  connectionTimer = setTimeout(() => playbackFailure(id, request), 20000);
  audio.play().then(() => {
    if (request !== attempt) return;
    clearTimeout(connectionTimer);
    availability.textContent = 'EN DIRECT · ' + stations[id].name;
    document.querySelector('#dockStatus').textContent = 'En direct';
    recovery.hidden = true;
    syncDock();
  }).catch(error => {
    if (error.name !== 'AbortError') playbackFailure(id, request);
  });
};
document.querySelector('#dockPlay').onclick = () => {
  if (!playingId) return startStation();
  if (!audio.paused) audio.pause();
  else audio.play().catch(() => playbackFailure(playingId, attempt));
};
document.querySelector('#retryRadio').onclick = () => {
  if (playingId) current = playingId;
  updateSelection();
  startStation();
};
document.querySelector('#similarRadio').onclick = () => {
  const failed = stations[playingId || current];
  const all = Object.keys(stations).filter(id => id !== playingId && id !== current && extraFilter(id));
  const sameGenre = all.filter(id => stations[id].genres.some(genre => failed.genres.includes(genre)));
  const nearby = sameGenre.filter(id => stations[id].country === failed.country);
  const list = nearby.length ? nearby : sameGenre;
  if (list.length) {
    activeCountry = 'all';
    document.querySelectorAll('[data-country]').forEach(button => button.classList.toggle('active', button.dataset.country === 'all'));
    selectStation(list[Math.floor(Math.random() * list.length)], true);
  } else {
    availability.textContent = 'Pas d’autre radio du même style disponible. Réessaie ou change de filtre.';
  }
};
audio.addEventListener('error', () => { if (playingId) playbackFailure(playingId, attempt); });
audio.addEventListener('playing', () => {
  clearTimeout(connectionTimer);
  document.querySelector('#dockStatus').textContent = 'En direct';
  syncDock();
});
audio.addEventListener('pause', () => {
  document.querySelector('#dockStatus').textContent = 'En pause';
  syncDock();
});
let touchStart = null;
wheelTrack.addEventListener('touchstart', event => {
  touchStart = {x:event.touches[0].clientX, y:event.touches[0].clientY};
}, {passive:true});
wheelTrack.addEventListener('touchend', event => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) rotate(dx > 0 ? -1 : 1);
  touchStart = null;
}, {passive:true});
refreshFavorites();
syncDock();
refreshPrograms();
