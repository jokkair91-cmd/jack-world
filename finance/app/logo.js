// Logo Jack Finance : J et F dorés sur un disque vert foncé, double anneau d'or et trait de lumière (même logo que le site).
// p = préfixe unique pour les identifiants SVG ; anime = version animée (présentation).
function logoSvg(p = 'l', anime = false) {
  const J = 'M47 21 L67 11 L57 70 C53 89 41 97 25 97 C14 97 8 91 5 81 L22 73 C23 80 27 83 32 83 C38 83 42 78 43 70 Z';
  const F = 'M67 11 H113 C110 20 104 27 94 28 H80 L77 41 H101 C98 50 92 55 84 56 H74 L67 90 C64 99 55 104 43 104 C37 104 40 101 46 97 C53 92 56 84 57 70 Z';
  const trait = 'M43 63 C58 49 79 36 104 30';
  const etoile = 'M106 22 L108 28.5 L114.5 30.5 L108 32.5 L106 39 L104 32.5 L97.5 30.5 L104 28.5 Z';
  return `<svg class="logo-jf ${anime ? 'logo-anime' : ''}" viewBox="0 0 200 200" role="img" aria-label="Jack Finance">
  <defs>
    <linearGradient id="${p}-or1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff3cc"/><stop offset=".32" stop-color="#f0d38a"/><stop offset=".62" stop-color="#d2a956"/><stop offset="1" stop-color="#9c712c"/>
    </linearGradient>
    <linearGradient id="${p}-vert" x1="0" y1="0" x2=".4" y2="1">
      <stop offset="0" stop-color="#f6dfa0"/><stop offset=".5" stop-color="#ddb56a"/><stop offset="1" stop-color="#b48740"/>
    </linearGradient>
    <linearGradient id="${p}-bleu" x1="0" y1="0" x2=".5" y2="1">
      <stop offset="0" stop-color="#eccb84"/><stop offset=".5" stop-color="#c99a4f"/><stop offset="1" stop-color="#8f6426"/>
    </linearGradient>
    <linearGradient id="${p}-anneau" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7e4ad"/><stop offset=".35" stop-color="#b98a3e"/><stop offset=".6" stop-color="#f3d996"/><stop offset="1" stop-color="#94692a"/>
    </linearGradient>
    <linearGradient id="${p}-eclat" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      ${anime ? `<animateTransform attributeName="gradientTransform" type="translate" values="-1 0; 1 0; 1 0" keyTimes="0; .45; 1" dur="4.5s" begin="1.6s" repeatCount="indefinite"/>` : ''}
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="99" fill="#06281f"/>
  <circle class="logo-anneau" cx="100" cy="100" r="94" fill="none" stroke="url(#${p}-anneau)" stroke-width="2.4" pathLength="1"/>
  <circle class="logo-anneau logo-anneau-2" cx="100" cy="100" r="86.5" fill="none" stroke="url(#${p}-anneau)" stroke-width=".8" opacity=".55" pathLength="1"/>
  <path class="logo-losange" d="M100 1.5 L104 6 L100 10.5 L96 6 Z" fill="url(#${p}-or1)"/>
  <g transform="translate(32 34.5) scale(1.15)">
    <path class="logo-lettre logo-j" d="${J}" fill="url(#${p}-vert)" stroke="url(#${p}-or1)" stroke-width="1.1" stroke-linejoin="round"/>
    <path class="logo-lettre logo-f" d="${F}" fill="url(#${p}-bleu)" stroke="url(#${p}-or1)" stroke-width="1.1" stroke-linejoin="round"/>
    ${anime ? `<path d="${J}" fill="url(#${p}-eclat)"/><path d="${F}" fill="url(#${p}-eclat)"/>` : ''}
    <path class="logo-trait" d="${trait}" fill="none" stroke="#fffaf0" stroke-width="3.4" stroke-linecap="round" pathLength="1"/>
    <path class="logo-etoile" d="${etoile}" fill="url(#${p}-or1)"/>
  </g>
</svg>`;
}
