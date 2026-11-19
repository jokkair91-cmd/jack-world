/* ---------- MIDI : détection du contrôleur et affectation par apprentissage ---------- */
var MIDI = {
  access: null, map: {}, learn: null, waiting: null, last: {},
  st(t) { document.getElementById('midiSt').textContent = t; },
  targets() {
    const t = {};
    decks.forEach(d => { ['play', 'cue', 'sync', 'loop'].forEach(r => { t['btn:' + d.id + '.' + r] = btnOf(d.id, r); }); d.pads.forEach((p, i) => { t['btn:' + d.id + '.hot' + i] = p; }); });
    t['btn:rec'] = document.getElementById('recBtn');
    document.querySelectorAll('[data-smp]').forEach(b => { t['btn:smp' + b.dataset.smp] = b; });
    for (const k in CTRL) t['ctl:' + k] = CTRL[k].el;
    return t;
  },
  tag() { const t = this.targets(); for (const k in t) if (t[k]) t[k].dataset.midi = k; },
  async enable() {
    if (!navigator.requestMIDIAccess) { this.st('MIDI non pris en charge par ce navigateur. Clavier et souris restent actifs.'); return; }
    try { this.access = await navigator.requestMIDIAccess({ sysex: false }); }
    catch (e) { this.st('Accès MIDI refusé ou indisponible. Clavier et souris restent actifs.'); return; }
    this.access.onstatechange = () => this.refresh();
    this.refresh();
    document.getElementById('midiLearn').disabled = false;
  },
  refresh() {
    const ins = [...this.access.inputs.values()].filter(i => i.state !== 'disconnected');
    ins.forEach(i => { i.onmidimessage = e => this.onMsg(e.data); });
    const n = Object.keys(this.map).length;
    this.st(ins.length ? `Contrôleur : ${ins.map(i => i.name || 'sans nom').join(', ')} · ${n} affectation(s).`
                       : `Aucun contrôleur MIDI branché (ou débranché). Clavier et souris restent actifs · ${n} affectation(s) gardée(s).`);
  },
  startLearn() {
    this.learn = 'pick'; this.waiting = null; this.tag();
    this.st('Affectation : touche une commande à l’écran (bouton, fader, potentiomètre)… Échap pour annuler.');
  },
  onMsg(data) {
    if (!data || data.length < 2) return;
    let type = data[0] & 0xf0; const ch = data[0] & 0x0f, d1 = data[1], d2 = data.length > 2 ? data[2] : 0;
    if (type === 0x80) { type = 0x90; }
    if (type !== 0x90 && type !== 0xb0) return;
    const key = type.toString(16) + ':' + ch + ':' + d1;
    if (this.learn === 'midi' && this.waiting && (type === 0xb0 || d2 > 0)) {
      this.map[key] = this.waiting; this.learn = null;
      this.st(`Affecté : ${this.waiting.replace(/^(btn|ctl):/, '')} ← ${type === 0x90 ? 'note' : 'CC'} ${d1} (canal ${ch + 1}).`);
      this.waiting = null; STORE.schedule(); return;
    }
    const target = this.map[key]; if (!target) return;
    ensureCtx();
    if (target.startsWith('ctl:')) {
      const c = CTRL[target.slice(4)];
      if (c && type === 0xb0) c.set(c.min + (d2 / 127) * (c.max - c.min));
      else if (c && type === 0x90 && data[0] >> 4 === 9 && d2 > 0) c.set(c.def);
    } else {
      const el = this.targets()[target];
      const pressed = (data[0] & 0xf0) === 0x90 ? d2 > 0 : d2 >= 64, was = !!this.last[key];
      this.last[key] = pressed;
      if (el && pressed && !was && !el.disabled) el.click();
    }
  }
};
document.addEventListener('pointerdown', e => {
  if (MIDI.learn !== 'pick') return;
  const el = e.target.closest('[data-midi]'); if (!el) return;
  e.preventDefault(); e.stopPropagation();
  MIDI.waiting = el.dataset.midi; MIDI.learn = 'midi';
  MIDI.st(`Affectation de « ${MIDI.waiting.replace(/^(btn|ctl):/, '')} » : bouge maintenant le bouton ou le fader du contrôleur…`);
}, true);
document.addEventListener('click', e => { if (MIDI.learn === 'midi' && e.target.closest('[data-midi]') && e.target.closest('[data-midi]').dataset.midi === MIDI.waiting) { e.preventDefault(); e.stopPropagation(); } }, true);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && MIDI.learn) { MIDI.learn = null; MIDI.waiting = null; MIDI.st('Affectation annulée.'); } });

(function buildCtlBox() {
  const box = document.getElementById('ctlBox');
  box.innerHTML = `<details class="keys"><summary>Raccourcis clavier</summary>
      <table>${KEYS.map(k => `<tr><td><kbd>${keyLabel(k[0])}</kbd></td><td>${k[1]}</td></tr>`).join('')}
      <tr><td><kbd>Maj</kbd> + chiffre</td><td>Effacer le repère rapide</td></tr></table>
      <p class="tool-st">Inactifs pendant une saisie (BPM, recherche) et sur un fader sélectionné, qui utilise déjà les flèches.</p>
    </details>
    <p class="tool-st" id="midiSt" aria-live="polite">MIDI inactif. Clique sur « Activer le MIDI » pour détecter un contrôleur.</p>
    <div class="row2"><button class="btn small" id="midiOn">Activer le MIDI</button><button class="btn small" id="midiLearn" disabled>Affecter une commande</button></div>
    <button class="btn small" id="midiClear" style="margin-top:6px;width:100%">Effacer les affectations MIDI</button>`;
  document.getElementById('midiOn').addEventListener('click', () => MIDI.enable());
  document.getElementById('midiLearn').addEventListener('click', () => MIDI.startLearn());
  document.getElementById('midiClear').addEventListener('click', () => { MIDI.map = {}; STORE.schedule(); MIDI.st('Affectations MIDI effacées.'); });
})();

document.getElementById('saveExport').addEventListener('click', () => STORE.exportFile());
document.getElementById('saveImport').addEventListener('change', e => { const f = e.target.files[0]; e.target.value = ''; if (f) STORE.importFile(f); });

