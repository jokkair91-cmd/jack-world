const audio = document.querySelector('#radioAudio');
const nameNode = document.querySelector('#stationName');
const metaNode = document.querySelector('#stationMeta');
const availability = document.querySelector('#availability');
const mainPlay = document.querySelector('#primaryPlay');
const soundToggle = document.querySelector('#soundToggle');
const stations = {
  skyrock:{name:'SKYROCK',meta:'FRANCE · RAP / R&B / URBAIN',stream:'https://icecast.skyrock.net/s/natio_aac_64k'},
  mouv:{name:'MOUV’',meta:'FRANCE · RAP & HIP-HOP',stream:'https://icecast.radiofrance.fr/mouv-hifi.aac'},
  hot97:{name:'HOT 97',meta:'USA · NEW YORK HIP-HOP',stream:'https://playerservices.streamtheworld.com/api/livestream-redirect/WQHTFMAAC.aac'},
  capital:{name:'CAPITAL XTRA',meta:'UK · RAP / R&B',stream:'https://media-the.musicradio.com/CapitalXTRANationalMP3'}
};
let current = null;
function setPlaying(playing){soundToggle.classList.toggle('playing',playing);soundToggle.innerHTML=playing?'❚❚ <span>PAUSE</span>':'▶ <span>PLAY</span>';mainPlay.textContent=playing?'❚❚':'▶';document.querySelectorAll('.station-card').forEach(card=>card.classList.toggle('selected',card.dataset.station===current));}
function startStation(id){const station=stations[id];current=id;audio.src=station.stream;audio.load();nameNode.textContent=station.name;metaNode.textContent=station.meta;availability.textContent=`Connexion à ${station.name}…`;audio.play().then(()=>{availability.textContent=`EN DIRECT · ${station.name}`;setPlaying(true)}).catch(()=>{availability.textContent=`Lecture indisponible pour ${station.name}. Ce flux peut être limité dans ton pays.`;setPlaying(false)});}
document.querySelectorAll('.station-card').forEach(card=>card.addEventListener('click',()=>startStation(card.dataset.station)));
mainPlay.addEventListener('click',()=>current?(audio.paused?audio.play():audio.pause()):startStation('skyrock'));
soundToggle.addEventListener('click',()=>current?(audio.paused?audio.play():audio.pause()):startStation('skyrock'));
audio.addEventListener('play',()=>setPlaying(true));audio.addEventListener('pause',()=>setPlaying(false));audio.addEventListener('error',()=>{availability.textContent=`Lecture indisponible. Essaie une autre radio.`;setPlaying(false)});
document.querySelectorAll('[data-country]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-country]').forEach(item=>item.classList.remove('active'));button.classList.add('active');const country=button.dataset.country;document.querySelectorAll('.station-card').forEach(card=>card.classList.toggle('hidden',country!=='all'&&card.dataset.country!==country));}));
