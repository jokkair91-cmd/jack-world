/* ---------- Controls (knobs + faders) ---------- */
const kp = (a, r) => { const rad = a * Math.PI / 180; return [22 + r * Math.sin(rad), 22 - r * Math.cos(rad)]; };
function arc(a0, a1, r) {
  if (Math.abs(a1 - a0) < 0.5) return '';
  const [x0, y0] = kp(a0, r), [x1, y1] = kp(a1, r);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

const CTRL = {}; // commandes enregistrées (sauvegarde des préférences, MIDI)
function control(el, onChange, key) {
  const min = +el.dataset.min, max = +el.dataset.max;
  const def = el.dataset.def !== undefined ? +el.dataset.def : +el.dataset.value;
  const isKnob = el.classList.contains('knob'), vertical = el.classList.contains('v');
  const bip = el.hasAttribute('data-bipolar');
  let value = +el.dataset.value, lastTap = 0, startY = 0, startV = 0, rect = null;
  el.tabIndex = 0; el.setAttribute('role', 'slider');
  el.setAttribute('aria-valuemin', min); el.setAttribute('aria-valuemax', max);
  let val, ptr;
  if (isKnob) {
    el.innerHTML = `<svg viewBox="0 0 44 44" aria-hidden="true"><path class="k-bg" d="${arc(-135, 135, 19)}"/><path class="k-val"/><circle class="k-body" cx="22" cy="22" r="14.5"/><line class="k-ptr" x1="22" y1="22" x2="22" y2="11"/></svg>`;
    val = el.querySelector('.k-val'); ptr = el.querySelector('.k-ptr');
  }
  function render() {
    const t = (value - min) / (max - min);
    el.style.setProperty('--t', t);
    el.setAttribute('aria-valuenow', value.toFixed(3));
    if (isKnob) {
      const a = -135 + 270 * t, z = bip ? -135 + 270 * ((0 - min) / (max - min)) : -135;
      val.setAttribute('d', arc(Math.min(a, z), Math.max(a, z), 19));
      const [x, y] = kp(a, 11); ptr.setAttribute('x2', x.toFixed(2)); ptr.setAttribute('y2', y.toFixed(2));
    }
  }
  const api = {
    get value() { return value; },
    set(v, emit = true) { value = clamp(v, min, max); render(); if (emit) { onChange(value); if (key && typeof STORE !== 'undefined') STORE.schedule(); } },
    min, max, def, el
  };
  if (key) CTRL[key] = api;
  function fromPointer(e) {
    const pad = 10;
    const t = vertical ? 1 - (e.clientY - rect.top - pad) / (rect.height - 2 * pad)
                       : (e.clientX - rect.left - pad) / (rect.width - 2 * pad);
    api.set(min + clamp(t, 0, 1) * (max - min));
  }
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    const now = performance.now();
    if (now - lastTap < 300) { api.set(def); lastTap = 0; return; }
    lastTap = now;
    capture(el, e); el.focus({ preventScroll: true });
    if (isKnob) { startY = e.clientY; startV = value; }
    else { rect = el.getBoundingClientRect(); fromPointer(e); }
  });
  el.addEventListener('pointermove', e => {
    if (!el.hasPointerCapture(e.pointerId) && el.dataset.drag !== String(e.pointerId)) return;
    if (isKnob) api.set(startV + (startY - e.clientY) / 150 * (max - min)); else fromPointer(e);
  });
  const release = () => { delete el.dataset.drag; };
  el.addEventListener('pointerup', release); el.addEventListener('pointercancel', release); el.addEventListener('lostpointercapture', release);
  el.addEventListener('keydown', e => {
    const step = (max - min) / 50;
    const map = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step };
    if (e.key in map) { e.preventDefault(); api.set(value + map[e.key]); }
    else if (e.key === 'Home') { e.preventDefault(); api.set(min); }
    else if (e.key === 'End') { e.preventDefault(); api.set(max); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); api.set(def); }
  });
  render();
  return api;
}

