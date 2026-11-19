/* ---------- Préécoute casque : seconde sortie via un élément audio dirigé vers un autre périphérique ---------- */
let cueBus = null, cueVol = null, cueDest = null;
const HP = {
  vol: 0.8, cue: { A: false, B: false }, deviceId: '', masterId: '', active: false, el: null, devices: [],
  supported: typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype && !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices),
  state(t) { document.getElementById('cueState').textContent = t; },
  applyGains() {
    if (!ctx) return;
    decks.forEach(d => d.n.cue.gain.setTargetAtTime(this.active && this.cue[d.id] ? 1 : 0, ctx.currentTime, 0.01));
    document.querySelectorAll('[data-cue]').forEach(b => b.setAttribute('aria-pressed', String(this.cue[b.dataset.cue])));
  },
  setVol(v) { this.vol = v; if (cueVol) cueVol.gain.setTargetAtTime(v, ctx.currentTime, 0.02); },
  toggle(id) {
    this.cue[id] = !this.cue[id]; ensureCtx(); this.applyGains();
    if (this.cue[id] && !this.active) this.state(this.supported ? 'Casque : choisis une sortie séparée dans « Sorties audio » pour entendre la préécoute. Le Master n’est pas touché.' : 'Casque : ce navigateur ne permet pas de choisir une seconde sortie. Le Master fonctionne normalement.');
  },
  async scan(ask) {
    if (!this.supported) { this.state('Casque : choix de sortie non pris en charge par ce navigateur. Le Master fonctionne normalement.'); return; }
    try {
      if (ask) { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); s.getTracks().forEach(t => t.stop()); }
      const all = await navigator.mediaDevices.enumerateDevices();
      this.devices = all.filter(x => x.kind === 'audiooutput' && x.deviceId && x.deviceId !== 'default' && x.deviceId !== 'communications');
    } catch (e) { this.devices = []; if (ask) this.state('Casque : accès refusé, les noms des sorties restent masqués.'); }
    const fill = (sel, first, cur) => {
      sel.innerHTML = `<option value="">${first}</option>` + this.devices.map((x, i) => `<option value="${x.deviceId}">${x.label || 'Sortie ' + (i + 1)}</option>`).join('');
      sel.value = this.devices.some(x => x.deviceId === cur) ? cur : '';
    };
    fill(document.getElementById('outMaster'), 'Sortie par défaut', this.masterId);
    fill(document.getElementById('outCue'), 'Aucune sortie séparée', this.deviceId);
    if (!this.devices.length && !ask) this.state('Casque : aucune seconde sortie visible. Branche un casque ou une carte son, puis « Afficher les noms des sorties ».');
    // la sortie casque choisie a disparu (débranchée)
    if (this.active && this.deviceId && !this.devices.some(x => x.deviceId === this.deviceId)) this.lost();
  },
  lost() {
    this.active = false; this.applyGains();
    if (this.el) { try { this.el.pause(); } catch (e) {} }
    this.state('Casque : sortie débranchée ou indisponible, préécoute coupée. Le Master continue normalement.');
  },
  async setCue(id) {
    this.deviceId = id; ensureCtx(); STORE.schedule();
    if (!id) { this.active = false; this.applyGains(); if (this.el) this.el.pause(); this.state('Casque : aucune sortie séparée choisie, la préécoute est inactive.'); return; }
    if (id === this.masterId) { this.active = false; this.applyGains(); this.state('Casque : même sortie que les enceintes, préécoute désactivée pour ne pas mélanger.'); return; }
    try {
      if (!this.el) { this.el = new Audio(); this.el.srcObject = cueDest.stream; this.el.addEventListener('error', () => this.lost()); }
      await this.el.setSinkId(id); await this.el.play();
      this.active = true; this.applyGains();
      const lbl = (this.devices.find(x => x.deviceId === id) || {}).label || 'sortie choisie';
      this.state('Casque actif sur « ' + lbl + ' ». Les platines cochées s’y entendent, hors Master et hors enregistrement.');
    } catch (e) { this.active = false; this.applyGains(); this.state('Casque : impossible d’utiliser cette sortie (' + (e && e.name || 'erreur') + '). Le Master fonctionne normalement.'); }
  },
  async setMaster(id) {
    this.masterId = id; this.applyMaster(); STORE.schedule();
    if (this.deviceId && this.deviceId === id) this.setCue(this.deviceId);
  },
  async applyMaster() {
    if (!ctx || !('setSinkId' in ctx)) return;
    try { await ctx.setSinkId(this.masterId || ''); } catch (e) { this.state('Enceintes : sortie indisponible, retour à la sortie par défaut.'); this.masterId = ''; try { await ctx.setSinkId(''); } catch (e2) {} }
  }
};
if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) navigator.mediaDevices.addEventListener('devicechange', () => HP.scan(false));

