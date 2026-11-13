const clubMotion = document.querySelector('#clubMotion');
document.querySelector('.immersive-player .eyebrow').textContent = 'JACK RADIO';
document.querySelector('.now-card p').textContent = 'MAINTENANT SUR JACK RADIO';
document.querySelector('.stage-copy .eyebrow').textContent = 'JACK RADIO';
document.querySelector('.stage-copy > p:last-child').textContent = 'Le rap, le R&B, le shatta, le dancehall et les sons caribéens — dans Jack Radio.';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncClubMotion() {
  const enabled = document.body.dataset.ambience !== 'calm' && !reducedMotion.matches;
  clubMotion.textContent = enabled ? 'Ambiance animée · pause' : 'Ambiance calme · activer';
  clubMotion.setAttribute('aria-pressed', String(enabled));
}
clubMotion.onclick = () => {
  ambience.value = document.body.dataset.ambience === 'calm' ? 'festive' : 'calm';
  applyAmbience();
  syncClubMotion();
};
ambience.addEventListener('change', syncClubMotion);
reducedMotion.addEventListener('change', syncClubMotion);
syncClubMotion();
