const audio = document.querySelector('#radioAudio');
const nameNode = document.querySelector('#stationName');
const metaNode = document.querySelector('#stationMeta');
const availability = document.querySelector('#availability');
const mainPlay = document.querySelector('#primaryPlay');
const soundToggle = document.querySelector('#soundToggle');
const wheelTrack = document.querySelector('#wheelTrack');
const selectedName = document.querySelector('#selectedName');
const selectedType = document.querySelector('#selectedType');
const selectedZone = document.querySelector('#selectedZone');
const wheelPlay = document.querySelector('#wheelPlay');
const stationCount = document.querySelector('#stationCount');

const stations = {
  tracecg:{name:'TRACE FM CONGO',meta:'CONGO · MUSIQUE URBAINE',country:'af',zone:'CG',type:'AFRO · URBAIN',stream:'https://stream.rcs.revma.com/u98b8f5q54zuv',tone:'violet',mark:'TRACE'},
  kledu:{name:'RADIO KLÉDU',meta:'MALI · BAMAKO',country:'af',zone:'ML',type:'MUSIQUE · CULTURE',stream:'https://stream.zeno.fm/f38bxpt3v2quv',tone:'gold',mark:'KLÉDU'},
  hitmaroc:{name:'HIT RADIO MAROC',meta:'MAROC · HITS',country:'af',zone:'MA',type:'HITS · MUSIQUE',stream:'https://hitradio-maroc.ice.infomaniak.ch/hitradio-maroc-128.mp3',tone:'red',mark:'HIT'},
  traceci:{name:'TRACE FM ABIDJAN',meta:'CÔTE D’IVOIRE · HIP-HOP / R&B',country:'af',zone:'CI',type:'HIP-HOP · R&B · URBAIN',stream:'https://stream.rcs.revma.com/wvx3tf5q54zuv',tone:'orange',mark:'TRACE'},
  skyci:{name:'SKYROCK ABIDJAN',meta:'CÔTE D’IVOIRE · URBAIN',country:'af',zone:'CI',type:'RAP · AFRO · URBAIN',stream:'https://icecast.skyrock.net/s/abidjan_aac_64k',tone:'gold',mark:'ABJ'},
  camerhits:{name:'CAMERHITS',meta:'CAMEROUN · MUSIQUE',country:'af',zone:'CM',type:'HITS CAMEROUNAIS',stream:'https://camerhits.com/icecast/stream',tone:'teal',mark:'CH'},
  onair237:{name:'237ONAIR',meta:'CAMEROUN · MUSIQUE',country:'af',zone:'CM',type:'SONS DU CAMEROUN',stream:'https://radio.237onair.com/listen/237onair/radio.mp3',tone:'lime',mark:'237'},
  sensi:{name:'SENSIMEDIA HIP-HOP',meta:'USA · UNDERGROUND HIP-HOP',country:'us',zone:'USA',type:'UNDERGROUND · RAP CLASSIQUE',stream:'https://sensihiphop.radioca.st/stream',tone:'blue',mark:'SENSI'},
  skyrock:{name:'SKYROCK',meta:'FRANCE · RAP / R&B / URBAIN',country:'fr',zone:'FR',type:'RAP · R&B · URBAIN',stream:'https://icecast.skyrock.net/s/natio_aac_64k',tone:'red',mark:'SKY'},
  skyfr:{name:'SKYROCK 100% FR',meta:'FRANCE · RAP FRANÇAIS',country:'fr',zone:'FR',type:'RAP FRANÇAIS',stream:'https://icecast.skyrock.net/s/francais_aac_64k',tone:'orange',mark:'100%'},
  skyclassics:{name:'SKYROCK KLASSIKS',meta:'FRANCE · CLASSIQUES RAP',country:'fr',zone:'FR',type:'CLASSIQUES RAP',stream:'https://icecast.skyrock.net/s/klassiks_aac_64k',tone:'gold',mark:'KLS'},
  mouv:{name:'MOUV’',meta:'FRANCE · RAP & HIP-HOP',country:'fr',zone:'FR',type:'RAP · HIP-HOP',stream:'https://icecast.radiofrance.fr/mouv-hifi.aac',tone:'pink',mark:'MOUV'},
  hot97:{name:'HOT 97',meta:'USA · NEW YORK HIP-HOP',country:'us',zone:'USA',type:'NEW YORK HIP-HOP',stream:'https://playerservices.streamtheworld.com/api/livestream-redirect/WQHTFMAAC.aac',tone:'red',mark:'HOT'},
  kday:{name:'93.5 KDAY',meta:'USA · LOS ANGELES HIP-HOP',country:'us',zone:'USA',type:'LOS ANGELES HIP-HOP',stream:'https://playerservices.streamtheworld.com/api/livestream-redirect/KDAYFMAAC.aac',tone:'cyan',mark:'KDAY'},
  oldschool:{name:'181.FM OLD SCHOOL',meta:'USA · HIP-HOP / R&B CLASSIC',country:'us',zone:'USA',type:'HIP-HOP & R&B CLASSIC',stream:'https://listen.181fm.com/181-oldschool_128k.mp3',tone:'gold',mark:'181'},
  gotradio:{name:'GOTRADIO HIP HOP',meta:'USA · HIP-HOP EN CONTINU',country:'us',zone:'USA',type:'HIP-HOP EN CONTINU',stream:'https://pureplay.cdnstream1.com/6041_128.mp3',tone:'violet',mark:'GOT'},
  bounce:{name:'105.1 THE BOUNCE',meta:'USA · HIP-HOP / URBAIN',country:'us',zone:'USA',type:'HIP-HOP / URBAIN',stream:'https://playerservices.streamtheworld.com/api/livestream-redirect/WMGCFMAAC.aac',tone:'pink',mark:'105'},
  westcoast:{name:'WEST COAST G-FUNK',meta:'USA · G-FUNK & HIP-HOP',country:'us',zone:'USA',type:'G-FUNK & HIP-HOP',stream:'https://r.bgp.rodeo/listen/west_coast/radio.mp3',tone:'lime',mark:'G-F'},
  hot108:{name:'NY HOT 108',meta:'USA · NEW YORK RAP / R&B',country:'us',zone:'USA',type:'NEW YORK RAP / R&B',stream:'https://live.powerhitz.com/hot108',tone:'orange',mark:'NY'},
  fubu:{name:'FUBU RADIO',meta:'USA · HIP-HOP / TRAP',country:'us',zone:'USA',type:'HIP-HOP · TRAP',stream:'https://streaming.radio.co/s9a5207ec7/listen',tone:'teal',mark:'FUBU'},
  capital:{name:'CAPITAL XTRA',meta:'UK · RAP / R&B / GRIME',country:'uk',zone:'UK',type:'RAP · R&B · GRIME',stream:'https://media-the.musicradio.com/CapitalXTRANationalMP3',tone:'violet',mark:'XTRA'},
  reload:{name:'XTRA RELOADED',meta:'UK · OLD SCHOOL HIP-HOP',country:'uk',zone:'UK',type:'OLD SCHOOL HIP-HOP',stream:'https://media-the.musicradio.com/CapitalXTRAReloadedMP3',tone:'gold',mark:'X-R'},
  reprezent:{name:'REPREZENT RADIO',meta:'UK · LONDON GRIME / HIP-HOP',country:'uk',zone:'UK',type:'LONDON GRIME · HIP-HOP',stream:'https://radio.canstream.co.uk:8022/live.mp3',tone:'lime',mark:'RZ'},
  kisstory:{name:'CJ CARLOS',meta:'UK · R&B / URBAN',country:'uk',zone:'UK',type:'R&B / URBAN',stream:'https://s3.radio.co/sf2bda8390/listen',tone:'pink',mark:'CJ'},
  funkysx:{name:'SD RADIO',meta:'UK · GRIME / HIP-HOP / R&B',country:'uk',zone:'UK',type:'GRIME · HIP-HOP · R&B',stream:'https://mystation.micast.media/radio/8020/radio.mp3',tone:'cyan',mark:'SD'},
  chocolate:{name:'CHOCOLATE RADIO',meta:'UK · R&B / URBAN',country:'uk',zone:'UK',type:'R&B / URBAN',stream:'https://stream.radio.co/sa7336b687/listen?ver=712690',tone:'orange',mark:'CHO'},
  shatta:{name:'SHATTA MOVEMENT',meta:'GHANA · RADIO MUSICALE',country:'af',zone:'GH',type:'PROGRAMMATION VARIÉE',stream:'https://stream-178.zeno.fm/pbnss8oxyluuv',tone:'lime',mark:'SM'},
  antilles:{name:'ANTILLES MÉDIA KOMPA',meta:'GUADELOUPE · KOMPA / CARAÏBES',country:'car',zone:'GUA',type:'KOMPA · CARAÏBES',stream:'https://antillesmedia.pro-fhi.net/antillesmediakompa',tone:'gold',mark:'AM'},
  dancehall:{name:'RCI DANCEHALL',meta:'MARTINIQUE · DANCEHALL / CARAÏBES',country:'car',zone:'MQ',type:'DANCEHALL · CARAÏBES',stream:'https://stream.rcs.revma.com/5stt0yrtpwzuv',tone:'red',mark:'MQ'},
  guyane:{name:'GUYANE 1ÈRE',meta:'GUYANE · SON & CULTURE LOCALE',country:'car',zone:'GF',type:'GUYANE · CULTURE LOCALE',stream:'https://guyane.ice.infomaniak.ch/guyane-128.mp3',tone:'teal',mark:'GF'},
  kiskeya:{name:'RADIO KISKEYA',meta:'HAÏTI · PORT-AU-PRINCE',country:'car',zone:'HT',type:'HAÏTI · PORT-AU-PRINCE',stream:'https://stream.zeno.fm/82q102t62neuv',tone:'blue',mark:'HT'},
  mole:{name:'MOLE FM',meta:'HAÏTI · KONPA / CARAÏBES',country:'car',zone:'HT',type:'KONPA · CARAÏBES',stream:'https://molefm-radio-stream.molefm.workers.dev/radio/stream.mp3',tone:'lime',mark:'MOLE'}
};

Object.assign(stations, {
  casarap: {name:'SKYROCK CASABLANCA',meta:'MAROC · RAP / R&B',country:'mag',zone:'MA',type:'RAP · R&B',stream:'https://icecast.skyrock.net/s/casa_aac_64k',tone:'orange',mark:'CASA'},
  lbeldi: {name:'RAP LBELDI MAROC',meta:'MAROC · RAP MAROCAIN',country:'mag',zone:'MA',type:'RAP MAROCAIN · HIP-HOP',stream:'https://stream.zeno.fm/ivdufrl7q0quv',tone:'gold',mark:'LBELDI'},
  algerrap: {name:'SKYROCK ALGER',meta:'ALGÉRIE · RAP / R&B',country:'mag',zone:'DZ',type:'RAP · R&B',stream:'https://icecast.skyrock.net/s/alger_aac_64k',tone:'lime',mark:'ALGER'},
  jowrap: {name:'JOW RADIO RAP',meta:'ALGÉRIE · RAP / HIP-HOP',country:'mag',zone:'DZ',type:'RAP · HIP-HOP',stream:'https://azuracast.dataplayapps.com/listen/rap/radio.mp3',tone:'violet',mark:'JOW'},
  tunisrap: {name:'SKYROCK TUNIS',meta:'TUNISIE · RAP / R&B',country:'mag',zone:'TN',type:'RAP · R&B',stream:'https://icecast.skyrock.net/s/tunis_aac_64k',tone:'red',mark:'TUNIS'},
  losurban: {name:'LOS40 URBAN',meta:'ESPAGNE · URBAIN LATINO',country:'es',zone:'ES',type:'REGGAETON · URBAIN LATINO',stream:'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_URBAN.mp3',tone:'pink',mark:'LOS40'},
  deutschrap: {name:'RM.FM DEUTSCHRAP',meta:'ALLEMAGNE · RAP ALLEMAND',country:'de',zone:'DE',type:'RAP ALLEMAND · HIP-HOP',stream:'https://deutschrap-high.rautemusik.fm/',tone:'cyan',mark:'DE RAP'},
  declassic: {name:'RM.FM DEUTSCHRAP CLASSIC',meta:'ALLEMAGNE · CLASSIQUES RAP',country:'de',zone:'DE',type:'RAP ALLEMAND · CLASSIQUES',stream:'https://deutschrap-classic-high.rautemusik.fm/',tone:'gold',mark:'CLASSIC'},
  rmjam: {name:'RM.FM JAM',meta:'ALLEMAGNE · HIP-HOP / R&B',country:'de',zone:'DE',type:'HIP-HOP · R&B · URBAIN',stream:'https://jam-high.rautemusik.fm/',tone:'teal',mark:'JAM'}
});
stations.hitmaroc.country = 'mag';

Object.assign(stations, {
  tropiquesshatta:{name:'TROPIQUES SHATTA',meta:'FRANCE · CULTURE ANTILLAISE',country:'fr',zone:'FR',type:'100 % SHATTA',stream:'https://listen.radioking.com/radio/788501/stream/856316',tone:'lime',mark:'SHATTA'},
  genrnb:{name:'GÉNÉRATIONS R&B',meta:'FRANCE · WEBRADIO R&B',country:'fr',zone:'FR',type:'R&B',stream:'https://generationfm-slowjam.ice.infomaniak.ch/generationfm-slowjam-high.mp3',tone:'pink',mark:'R&B'},
  genafro:{name:'GÉNÉRATIONS AFROBEAT',meta:'FRANCE · WEBRADIO AFROBEAT',country:'fr',zone:'FR',type:'AFROBEAT · AFROPOP',stream:'https://generations-wr001.ice.infomaniak.ch/generations-wr001.aac',tone:'gold',mark:'AFRO'},
  gendance:{name:'GÉNÉRATIONS DANCEHALL',meta:'FRANCE · WEBRADIO DANCEHALL',country:'fr',zone:'FR',type:'DANCEHALL',stream:'https://generations-dancehall.ice.infomaniak.ch/generations-dancehall.aac',tone:'red',mark:'DANCE'},
  genreggaeton:{name:'GÉNÉRATIONS REGGAETON',meta:'FRANCE · WEBRADIO REGGAETON',country:'fr',zone:'FR',type:'REGGAETON · LATINO',stream:'https://gene-rgton.ice.infomaniak.ch/generations-rgton.mp3',tone:'orange',mark:'LATINO'},
  genuk:{name:'GÉNÉRATIONS RAP UK',meta:'FRANCE · WEBRADIO RAP BRITANNIQUE',country:'fr',zone:'FR',type:'RAP UK',stream:'https://generationsuk.ice.infomaniak.ch/generations-uk.mp3',tone:'violet',mark:'UK RAP'}
});
// Membership is editorial, never inferred from a country or the word "urban".
// Generalist stations stay in "Tous les sons" without invented genre claims.
const genreMembers = {
  rap:['sensi','skyrock','skyfr','skyclassics','mouv','hot97','kday','oldschool','gotradio','bounce','westcoast','hot108','fubu','capital','reload','reprezent','funkysx','traceci','skyci','casarap','lbeldi','algerrap','jowrap','tunisrap','deutschrap','declassic','rmjam','genuk'],
  'r&b':['skyrock','oldschool','hot108','capital','kisstory','chocolate','traceci','casarap','algerrap','tunisrap','rmjam','genrnb'],
  grime:['genuk','reprezent','capital','funkysx'],
  shatta:['tropiquesshatta'],
  dancehall:['dancehall','gendance'],
  afro:['genafro'],
  reggaeton:['losurban','genreggaeton']
};
for (const [id, station] of Object.entries(stations)) {
  station.genres = Object.keys(genreMembers).filter(genre => genreMembers[genre].includes(id));
}

const animalPaths = {
  CM:'M32 3 41 8 51 8 54 19 61 26 57 38 53 49 44 54 32 63 20 54 11 49 7 38 3 26 10 19 13 8 23 8Z M16 23 20 39 26 48 32 52 38 48 44 39 48 23 39 18 32 23 25 18Z M21 28 28 30 25 34Z M43 28 39 34 36 30Z M27 39 37 39 32 45Z',
  CI:'M4 24 8 13 21 10 32 14 43 10 56 13 60 24 55 41 45 47 39 41 38 53 44 53 47 49 51 53 46 60 36 60 30 56 28 42 22 47 10 41Z M19 26 26 29 22 32Z M45 26 42 32 38 29Z M12 34 17 40 24 40 19 36Z M52 34 45 36 40 40 47 40Z',
  CG:'M7 10 17 12 24 16 40 16 47 12 57 10 56 23 61 34 53 46 43 51 39 58 25 58 21 51 11 46 3 34 8 23Z M12 29 26 32 22 38 16 36Z M52 29 48 36 42 38 38 32Z M25 43 39 43 32 50Z M25 53 32 51 39 53 32 56Z',
  ML:'M32 25 39 20 37 28 45 23 61 9 58 25 49 37 40 43 47 47 38 47 36 57 32 52 28 57 26 47 17 47 24 43 15 37 6 25 3 9 19 23 27 28Z',
  MA:'M32 3 39 23 61 23 43 36 50 57 32 44 14 57 21 36 3 23 25 23Z M32 15 27 31 43 31 30 40 34 25 21 34 37 34Z'
};

let current = 'skyrock';
let activeCountry = 'all';
let extraFilter = () => true;
const radioFamilies = {
  SKYROCK:['skyrock','skyfr','skyclassics','skyci','casarap','algerrap','tunisrap'],
  GÉNÉRATIONS:['genrnb','genafro','gendance','genreggaeton','genuk'],
  'RM.FM':['deutschrap','declassic','rmjam'],
  'CAPITAL XTRA':['capital','reload'],
  'TRACE FM':['traceci','tracecg']
};
for (const [family, members] of Object.entries(radioFamilies)) {
  members.forEach(id => { stations[id].family = family; });
}
const matchingIds = () => Object.keys(stations).filter(id => (activeCountry === 'all' || stations[id].country === activeCountry) && extraFilter(id));
const ids = () => {
  const families = new Map();
  for (const id of matchingIds()) {
    const key = stations[id].family || id;
    if (!families.has(key) || id === current) families.set(key, id);
  }
  return [...families.values()];
};
const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function setPlaying(playing) {
  document.body.classList.toggle('playing', playing);
  soundToggle.classList.toggle('playing', playing);
  soundToggle.innerHTML = playing ? '❚❚ <span>PAUSE</span>' : '▶ <span>PLAY</span>';
  mainPlay.textContent = playing ? '❚❚' : '▶';
  wheelPlay.innerHTML = playing ? '❚❚ <span>PAUSE</span>' : '▶ <span>ÉCOUTER</span>';
}

function updateSelection() {
  const station = stations[current];
  document.body.dataset.tone = station.tone;
  document.body.dataset.scene = ({FR:'paris',USA:['kday','westcoast'].includes(current)?'la':'ny',UK:'london',GUA:'guada',MQ:'martinique',GF:'guyane',HT:'haiti',CI:'afrique',CM:'afrique',CG:'afrique',ML:'afrique',GH:'afrique',MA:'maghreb',DZ:'maghreb',TN:'maghreb',ES:'espagne',DE:'allemagne'})[station.zone];
  document.body.dataset.station = current;
  nameNode.textContent = station.name;
  metaNode.textContent = station.meta;
  selectedName.textContent = station.name;
  selectedType.textContent = station.type;
  selectedZone.textContent = station.zone;
  renderWheel();
  if (typeof refreshPrograms === 'function') refreshPrograms();
}

function renderWheel() {
  const visible = ids();
  stationCount.textContent = visible.length + ' RADIOS';
  if (!visible.length) {
    wheelTrack.innerHTML = '<p>Aucune radio ne correspond. Modifie tes filtres.</p>';
    selectedName.textContent = 'AUCUNE RADIO';
    selectedType.textContent = 'Essaie un autre style ou toutes les destinations.';
    selectedZone.textContent = '—';
    wheelPlay.disabled = true;
    return;
  }
  wheelPlay.disabled = false;
  if (!visible.includes(current)) current = visible[0];
  const index = visible.indexOf(current);
  const displayed = visible.length > 1 ? [visible[(index - 1 + visible.length) % visible.length], current, visible[(index + 1) % visible.length]] : [current];
  const unique = [...new Set(displayed)];
  wheelTrack.innerHTML = unique.map(id => {
    const station = stations[id];
    const pos = id === current ? 'is-active' : id === displayed[0] ? 'is-prev' : 'is-next';
    const symbol = animalPaths[station.zone];
    const badge = symbol ? `<svg viewBox="0 0 64 64"><path fill="currentColor" fill-rule="evenodd" d="${symbol}"/></svg>` : '';
    return `<button class="wheel-card ${pos}" data-station="${id}" aria-label="Choisir ${escapeHTML(station.name)}"><span class="wheel-code">${station.zone} · LIVE</span><span class="wheel-logo station-art ${symbol ? 'symbol-badge' : ''}" aria-hidden="true">${badge}<b>${escapeHTML(station.mark)}</b></span><span><h3>${escapeHTML(station.family || station.name)}</h3><p>${escapeHTML(station.type)}</p></span></button>`;
  }).join('');
  wheelTrack.querySelectorAll('[data-station]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.station;
    if (id === current) togglePlayback(); else selectStation(id, !audio.paused && Boolean(audio.src));
  }));
  stationCount.textContent = activeCountry === 'all' ? `${visible.length} STATIONS` : `${visible.length} RADIOS DANS CETTE SÉLECTION`;
}

function selectStation(id, shouldPlay = false) {
  current = id;
  updateSelection();
  availability.textContent = `${stations[id].name} est au centre. Appuie sur ÉCOUTER.`;
  if (shouldPlay) startStation();
}

function startStation() {
  const station = stations[current];
  audio.src = station.stream;
  audio.load();
  availability.textContent = `Connexion à ${station.name}…`;
  audio.play().then(() => { availability.textContent = `EN DIRECT · ${station.name}`; setPlaying(true); }).catch(() => { availability.textContent = `Lecture indisponible pour ${station.name}. Ce flux peut être limité dans ton pays.`; setPlaying(false); });
}

function togglePlayback() {
  if (!ids().includes(current)) {
    availability.textContent = 'Aucune radio dans cette sélection. Modifie tes filtres.';
    return;
  }
  if (audio.src !== stations[current].stream) return startStation();
  if (audio.paused) audio.play().catch(() => startStation()); else audio.pause();
}

function rotate(direction) {
  const visible = ids();
  if (!visible.length) return;
  const index = visible.indexOf(current);
  const shouldPlay = !audio.paused && Boolean(audio.src);
  current = visible[(index + direction + visible.length) % visible.length];
  updateSelection();
  availability.textContent = `${stations[current].name} est au centre. Appuie sur ÉCOUTER.`;
  if (shouldPlay) startStation();
}

document.querySelector('#wheelPrevious').addEventListener('click', () => rotate(-1));
document.querySelector('#wheelNext').addEventListener('click', () => rotate(1));
wheelPlay.addEventListener('click', togglePlayback);
mainPlay.addEventListener('click', togglePlayback);
soundToggle.addEventListener('click', togglePlayback);
const africa = document.createElement('button');
africa.dataset.country = 'af';
africa.textContent = 'AFRIQUE';
document.querySelector('.country-tabs').append(africa);
for (const [country, label] of [['mag','MAGHREB'],['es','ESPAGNE'],['de','ALLEMAGNE']]) {
  const button = document.createElement('button');
  button.dataset.country = country;
  button.textContent = label;
  document.querySelector('.country-tabs').append(button);
}
document.querySelectorAll('[data-country]').forEach(button => button.addEventListener('click', () => {
  // Browsing a destination starts with its complete catalogue.
  if (typeof clearDiscoveryFilters === 'function') clearDiscoveryFilters();
  activeCountry = button.dataset.country;
  document.querySelectorAll('[data-country]').forEach(item => item.classList.toggle('active', item === button));
  const visible = ids();
  const shouldPlay = !audio.paused && Boolean(audio.src);
  const changedStation = !visible.includes(current);
  if (changedStation && visible.length) current = visible[0];
  updateSelection();
  availability.textContent = `${visible.length} radios dans cette sélection. Tourne la roulette.`;
  if (shouldPlay && changedStation && visible.length) startStation();
}));
audio.addEventListener('play', () => setPlaying(true));
audio.addEventListener('pause', () => setPlaying(false));
audio.addEventListener('error', () => { availability.textContent = 'Lecture indisponible. Essaie une autre radio.'; setPlaying(false); });
updateSelection();
