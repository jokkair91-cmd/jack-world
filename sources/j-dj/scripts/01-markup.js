/* ---------- Markup ---------- */
const jogSVG = id => `<svg viewBox="0 0 200 200" aria-hidden="true">
  <circle class="jog-rim" cx="100" cy="100" r="99"/>
  <circle class="jog-ring" cx="100" cy="100" r="93"/>
  <g class="disc">
    <circle class="vinyl" cx="100" cy="100" r="87"/>
    ${[80,74,68,62,56,50,44].map(r => `<circle class="groove" cx="100" cy="100" r="${r}"/>`).join('')}
    <path class="sheen" d="M100 100 L100 13 A87 87 0 0 1 161.5 38.5 Z"/>
    <rect class="mark" x="97.5" y="15" width="5" height="16" rx="2"/>
    <circle class="label" cx="100" cy="100" r="31"/>
    <text class="label-t" x="100" y="104" text-anchor="middle">J22</text>
    <text class="label-s" x="100" y="117" text-anchor="middle">Deck ${id}</text>
    <circle class="spindle" cx="100" cy="100" r="3"/>
  </g></svg>`;

const deckHTML = id => `<section class="panel deck" data-deck="${id}" aria-label="Platine ${id}">
  <div class="deck-head">
    <span class="badge">${id}</span>
    <div class="cover nocover" data-r="cover" aria-hidden="true"><span class="gbadge" data-r="gbadge"></span></div>
    <div class="now">
      <span class="now-st" data-r="state">Vide</span>
      <div class="track" data-r="name">Aucun son chargé</div>
      <div class="artist" data-r="artist"></div>
      <div class="meta"><span data-r="bpmTxt">— BPM</span><span data-r="durTxt"></span></div>
    </div>
    <div class="head-r"><div class="remain-big" data-r="remainBig">—:—</div><div class="bpm"><b data-r="bpm">—</b><small>BPM</small></div></div>
  </div>
  <div class="load">
    <label class="btn load-main">+ Charger un son<input type="file" accept="audio/*,.mp3,.wav" data-r="file"></label>
    <button class="btn" data-r="demo">Démo ${id === 'A' ? 'trap' : 'drill'}</button>
  </div>
  <div class="waves">
    <canvas class="wave" data-r="wave" aria-label="Forme d’onde, touche pour te déplacer"></canvas>
    <div class="zoomwrap">
      <canvas class="wave zoom" data-r="zoom" aria-label="Forme d’onde rapprochée, fais glisser pour te déplacer"></canvas>
      <div class="zoomctl"><button class="btn" data-r="zout" aria-label="Dézoomer">−</button><span data-r="zlbl">8 s</span><button class="btn" data-r="zin" aria-label="Zoomer">+</button></div>
    </div>
  </div>
  <div class="transport">
    <button class="btn" data-r="sync" disabled>Synchroniser</button>
    <button class="btn" data-r="cue" disabled>Repère</button>
    <button class="btn play-btn" data-r="play" aria-pressed="false" disabled>Lecture</button>
    <button class="btn" data-r="loop" aria-pressed="false" disabled>Boucle 4</button>
  </div>
  <div class="msg" data-r="msg" aria-live="polite"></div>
  <div class="d-jog">
    <div class="jog-wrap"><div class="jog" data-r="jog">${jogSVG(id)}</div></div>
    <div class="readout"><span data-r="time">0:00</span><span data-r="remain">-0:00</span></div>
  </div>
  <div class="d-side">
  <div class="slide-row"><span>Tempo</span><span class="sval" data-r="tval">0,0 %</span>
    <div class="fader h" data-r="tempo" data-min="-0.16" data-max="0.16" data-value="0" aria-label="Tempo platine ${id}"><span class="rail"></span><span class="mid"></span><span class="cap"></span></div></div>
  <div class="row2">
    <button class="btn small" data-r="scratch" aria-pressed="false">Mode scratch</button>
    <button class="btn small" data-r="keylock" aria-pressed="false" disabled title="Le fader change la vitesse sans changer la hauteur du son">Garder la tonalité</button>
  </div>
  <div class="row-label">Repères rapides</div>
  <div class="pads">${PADS.map((c, i) => `<button class="btn pad" data-pad="${i}" style="--pc:${c}" disabled>${i + 1}</button>`).join('')}</div>
  <details class="adv" data-adv="grid">
    <summary>BPM et grille</summary>
    <div class="beat">
      <input class="bpm-in" data-r="bpmin" type="number" min="40" max="250" step="0.1" inputmode="decimal" placeholder="BPM" aria-label="BPM de référence platine ${id}" disabled>
      <button class="btn small" data-r="tap" disabled>Tap tempo</button>
      <button class="btn small" data-r="downbeat" disabled>Placer le premier temps ici</button>
    </div>
    <div class="dbval" data-r="dbval">Grille : —</div>
  </details>
  <details class="adv" data-adv="loops">
    <summary>Boucles et Loop Roll</summary>
    <div class="row-label">Boucles (en temps)</div>
    <div class="pads">${LOOPS.map(b => `<button class="btn small" data-lsize="${b}" aria-pressed="false" disabled>${beatLbl(b)}</button>`).join('')}<button class="btn small" data-r="lhalf" disabled aria-label="Diviser la boucle par deux">÷2</button><button class="btn small" data-r="ldbl" disabled aria-label="Doubler la boucle">×2</button></div>
    <div class="row-label">Loop Roll (maintenir)</div>
    <div class="pads">${ROLLS.map(b => `<button class="btn small roll" data-roll="${b}" disabled aria-label="Loop Roll ${beatLbl(b)} temps">${beatLbl(b)}</button>`).join('')}</div>
  </details>
  <details class="adv" data-adv="fx">
    <summary>Effets <span class="adv-sum" data-r="fxsum"></span></summary>
    <div class="fx">${FX_UI.map(([k, lbl]) => `<div class="fxcell"><button class="btn small" data-fx="${k}" aria-pressed="false">${lbl}</button>
      <div class="fader h" data-fxamt="${k}" data-min="0" data-max="1" data-value="0.5" aria-label="Dosage ${lbl} platine ${id}"><span class="rail"></span><span class="cap"></span></div></div>`).join('')}</div>
    <div class="fx-note">Ordre : Filtre auto → Gate → Bitcrusher → Flanger → Écho → Réverb. Glissière = dosage de chaque effet.</div>
  </details>
  </div>
</section>`;

const knob = (p, label, ch, min = -1, max = 1, val = 0, bip = true) =>
  `<div class="knob-cell"><div class="knob" data-p="${p}" data-min="${min}" data-max="${max}" data-value="${val}" ${bip ? 'data-bipolar' : ''} aria-label="${label} ${ch}"></div><span>${label}</span></div>`;
const knobs = ch => `<div class="knobs">${knob('trim','Gain',ch)}${knob('high','Aigus',ch)}${knob('mid','Médiums',ch)}${knob('low','Basses',ch)}${knob('filter','Filtre',ch)}</div>`;
const fcol = ch => `<div class="fcol"><div class="vu" data-vu="${ch}"></div><div class="fader v" data-p="fader" data-min="0" data-max="1" data-value="0.8" data-def="0.8" aria-label="Volume ${ch}"><span class="rail"></span><span class="cap"></span></div></div>`;

// sampler : 4 sons fabriqués par J-DJ + 4 emplacements pour tes propres sons
const SMP_DEF = [
  { name: 'Corne', kind: 'horn', builtin: true, color: '#ff2a3a' }, { name: 'Sirène', kind: 'siren', builtin: true, color: '#9b4dff' },
  { name: 'Montée', kind: 'riser', builtin: true, color: '#17d4f2' }, { name: 'Impact', kind: 'impact', builtin: true, color: '#ff8a1c' },
  { name: 'Jack Studio', kind: 'tag', builtin: true, color: '#ff2a3a' }, { color: '#f5c72d' }, { color: '#ff5fb2' }, { color: '#7aa8ff' }
];
const SMP_KEYS = [['KeyT', 'T'], ['KeyY', 'Y'], ['KeyG', 'G'], ['KeyH', 'H'], ['KeyB', 'B'], ['KeyC', 'C'], ['KeyO', 'O'], ['KeyP', 'P']];
const HP_ICO = `<svg class="hp-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15v-3a8 8 0 0 1 16 0v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><rect x="3" y="13.5" width="5" height="7" rx="2" fill="currentColor"/><rect x="16" y="13.5" width="5" height="7" rx="2" fill="currentColor"/></svg>`;
const mixerHTML = `<section class="panel mixer" aria-label="Table de mixage">
  <div class="mix-tabs" role="tablist" aria-label="Mixeur"><button class="mtab on" role="tab" aria-selected="true" data-mtab="mix">Mixer</button><button class="mtab" role="tab" aria-selected="false" data-mtab="smp">Sampler</button><button class="mtab" role="tab" aria-selected="false" data-mtab="outs">Sorties</button></div>
  <div class="sampler" aria-label="Sampler">
    <div class="smp-pads">${SMP_DEF.map((p, i) => `<div class="smp-cell">
      <button class="btn smp-pad" data-smp="${i}" style="--pc:${p.color}"><span class="smp-n">${i + 1}</span><span class="smp-l" data-smpl="${i}">${p.name || 'Vide'}</span><kbd>${SMP_KEYS[i][1]}</kbd></button>
      ${p.builtin ? '' : `<div class="smp-act"><label class="btn small smp-load" title="Choisir un son (WAV ou MP3) pour le pad ${i + 1}">Charger<input type="file" accept="audio/*,.mp3,.wav" data-smpfile="${i}"></label><button class="btn small smp-del" data-smpdel="${i}" aria-label="Vider le pad ${i + 1}">×</button></div>`}
    </div>`).join('')}</div>
    <div class="smp-foot">${knob('smpvol', 'Volume', 'sampler', 0, 1, 0.8, false)}<button class="btn small" id="smpStop">Tout arrêter</button><p class="smp-st" id="smpSt" aria-live="polite">Touche un pad pour jouer le son, appui long pour l’arrêter.</p></div>
  </div>
  <div class="strip" data-ch="A">${knobs('A')}${fcol('A')}</div>
  <div class="center"><div class="vu" data-vu="M"></div><span class="clabel">Sortie</span></div>
  <div class="strip" data-ch="B">${fcol('B')}${knobs('B')}</div>
  <div class="cue-row">
    <button class="btn small hp" data-cue="A" aria-pressed="false" aria-label="Préécoute casque A" title="Préécoute casque A">${HP_ICO}<span>A</span></button>
    <div class="cue-knob">${knob('cuevol','Casque','volume',0,1,0.8,false)}</div>
    ${knob('master','Master','général',0,1,0.75,false)}
    <button class="btn small hp" data-cue="B" aria-pressed="false" aria-label="Préécoute casque B" title="Préécoute casque B">${HP_ICO}<span>B</span></button>
  </div>
  <details class="outs">
    <summary>Sorties audio</summary>
    <label>Enceintes (Master)<select id="outMaster"><option value="">Sortie par défaut</option></select></label>
    <label>Casque (préécoute)<select id="outCue"><option value="">Aucune sortie séparée</option></select></label>
    <button class="btn small" id="outScan">Afficher les noms des sorties</button>
    <p class="outs-st" id="cueState" aria-live="polite">Casque : aucune sortie séparée choisie, la préécoute est inactive.</p>
  </details>
  <div class="xf"><span class="la">A</span><div class="fader h wide" data-p="xf" data-min="-1" data-max="1" data-value="0" aria-label="Crossfader"><span class="rail"></span><span class="mid"></span><span class="cap"></span></div><span class="lb">B</span></div>
</section>`;

document.getElementById('console').innerHTML = deckHTML('A') + mixerHTML + deckHTML('B');

