/* ---------- Raccourcis clavier (positions physiques des touches : identiques en AZERTY et QWERTY pour ces lettres) ---------- */
const btnOf = (id, r) => document.querySelector(`.deck[data-deck="${id}"] [data-r="${r}"]`);
const padOf = (id, i) => document.querySelector(`.deck[data-deck="${id}"] [data-pad="${i}"]`);
const nudgeCtl = (key, dir) => { const c = CTRL[key]; if (c) c.set(c.value + dir * (c.max - c.min) / 25); };
const KEYS = [
  ['KeyF', 'A : Lecture / Pause', () => btnOf('A', 'play').click()], ['KeyD', 'A : Repère', () => btnOf('A', 'cue').click()],
  ['KeyS', 'A : Synchroniser', () => btnOf('A', 'sync').click()], ['KeyV', 'A : Boucle', () => btnOf('A', 'loop').click()],
  ['Digit1', 'A : Repère rapide 1', () => padOf('A', 0).click()], ['Digit2', 'A : Repère rapide 2', () => padOf('A', 1).click()],
  ['Digit3', 'A : Repère rapide 3', () => padOf('A', 2).click()], ['Digit4', 'A : Repère rapide 4', () => padOf('A', 3).click()],
  ['KeyE', 'A : Volume −', () => nudgeCtl('A.fader', -1), true], ['KeyR', 'A : Volume +', () => nudgeCtl('A.fader', 1), true],
  ['KeyJ', 'B : Lecture / Pause', () => btnOf('B', 'play').click()], ['KeyK', 'B : Repère', () => btnOf('B', 'cue').click()],
  ['KeyL', 'B : Synchroniser', () => btnOf('B', 'sync').click()], ['KeyN', 'B : Boucle', () => btnOf('B', 'loop').click()],
  ['Digit7', 'B : Repère rapide 1', () => padOf('B', 0).click()], ['Digit8', 'B : Repère rapide 2', () => padOf('B', 1).click()],
  ['Digit9', 'B : Repère rapide 3', () => padOf('B', 2).click()], ['Digit0', 'B : Repère rapide 4', () => padOf('B', 3).click()],
  ['KeyU', 'B : Volume −', () => nudgeCtl('B.fader', -1), true], ['KeyI', 'B : Volume +', () => nudgeCtl('B.fader', 1), true],
  ['ArrowLeft', 'Crossfader vers A', () => nudgeCtl('xf', -1), true], ['ArrowRight', 'Crossfader vers B', () => nudgeCtl('xf', 1), true],
  ['ArrowDown', 'Crossfader au centre', () => CTRL.xf && CTRL.xf.set(0)],
  ...SMP_KEYS.map(([code], i) => [code, `Sampler : pad ${i + 1}${SMP_DEF[i].name ? ' (' + SMP_DEF[i].name + ')' : ''}`, () => document.querySelector(`[data-smp="${i}"]`).click()])
];
const KEY_LABEL = { Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0', ArrowLeft: '←', ArrowRight: '→', ArrowDown: '↓' };
const keyLabel = c => KEY_LABEL[c] || c.replace('Key', '');
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  const t = e.target;
  // aucune action pendant une saisie (BPM, recherche) ni sur une commande qui utilise déjà les flèches
  if (t && (t.closest('input, textarea, select, [contenteditable="true"]') || (t.getAttribute && t.getAttribute('role') === 'slider'))) return;
  const k = KEYS.find(x => x[0] === e.code); if (!k) return;
  if (e.repeat && !k[3]) { e.preventDefault(); return; }
  e.preventDefault(); ensureCtx();
  if (e.shiftKey && /^Digit/.test(e.code)) { const id = ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code) ? 'A' : 'B'; const i = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit7', 'Digit8', 'Digit9', 'Digit0'].indexOf(e.code) % 4; decks[id === 'A' ? 0 : 1].hotClear(i); return; }
  k[2]();
});

