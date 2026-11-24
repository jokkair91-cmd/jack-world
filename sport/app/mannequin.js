// JACK SPORT : le coach en dessin animé (3D façon cartoon) qui montre chaque exercice (Three.js).
// Le corps est un squelette d'articulations ; chaque exercice donne quelques poses (en degrés)
// que l'on enchaîne en douceur. Le mannequin est posé au sol tout seul (ou pendu à la barre).
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const D = Math.PI / 180;

const LOOKS = {
  garcon: { skin: 0xc68a66, top: 0x13254a, bottom: 0x0e1a33, shin: 'skin', sleeve: true, shoe: 0xf2f2f4, sole: 0x7cff00, hair: 0x231610,
    sh: 0.205, hip: 0.098, torso: 0.56, waist: 0.135, chestW: 0.215, chestD: 0.125, ua: 0.295, fa: 0.27, th: 0.45, sn: 0.44, armR: 0.052, legR: 0.078 },
  fille: { skin: 0xe2ae8c, top: 0x13254a, bottom: 0x0e1a33, shin: 'bottom', sleeve: false, shoe: 0xf7f7f9, sole: 0x7cff00, hair: 0x4a2412,
    sh: 0.175, hip: 0.108, torso: 0.52, waist: 0.112, chestW: 0.18, chestD: 0.115, ua: 0.28, fa: 0.25, th: 0.44, sn: 0.42, armR: 0.044, legR: 0.08, ponytail: true },
};

const DEF = { sh: 0, shA: 7, el: -8, hip: 0, hipA: 3, knee: 2 };
const SIDES = ['sh', 'shA', 'el', 'hip', 'hipA', 'knee', 'ank'];

/** Transforme une pose abrégée en pose complète (côtés gauche/droite, pied à plat par défaut). */
export function expand(p) {
  const o = { rx: p.rx || 0, ry: p.ry || 0, rz: p.rz || 0, lift: p.lift || 0, spine: p.spine || 0, spineY: p.spineY || 0, spineZ: p.spineZ || 0, head: p.head || 0 };
  for (const k of SIDES) {
    const K = k[0].toUpperCase() + k.slice(1);
    for (const s of ['l', 'r']) {
      const v = p[s + K] ?? p[k] ?? DEF[k];
      o[s + K] = v;
    }
  }
  for (const s of ['l', 'r']) if (o[s + 'Ank'] === undefined) o[s + 'Ank'] = -(o[s + 'Hip'] + o[s + 'Knee']);
  return o;
}

function lerpPose(a, b, t) {
  const o = {};
  for (const k in a) o[k] = a[k] + (b[k] - a[k]) * t;
  return o;
}

/** Pose à l'instant « phase » (0 → 1) d'un cycle de l'exercice. */
export function sample(anim, phase, frames) {
  const n = frames.length;
  phase = ((phase % 1) + 1) % 1; // jamais négatif (sinon pose vide et le coach disparaît)
  if (!Number.isFinite(phase)) phase = 0;
  if (n === 1) {
    const p = { ...frames[0] };
    p.spine += Math.sin(phase * Math.PI * 2) * 1.2; // respiration
    return p;
  }
  const seg = phase * n;
  const i = Math.floor(seg) % n;
  const f = seg - Math.floor(seg);
  const hold = anim.hold ?? 0.12;
  let e = Math.min(1, Math.max(0, (f - hold) / (1 - 2 * hold)));
  e = e * e * (3 - 2 * e);
  return lerpPose(frames[i], frames[(i + 1) % n], e);
}

// ---------- rendu dessin animé : couleurs en aplats, 3 tons d'ombre, contour noir ----------
const TONES = (() => {
  const v = [125, 200, 255];
  const data = new Uint8Array(v.length * 4);
  v.forEach((x, i) => data.set([x, x, x, 255], i * 4));
  const t = new THREE.DataTexture(data, v.length, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
})();
const INK = new THREE.MeshBasicMaterial({ color: 0x050a12, side: THREE.BackSide });

function material(color, extra = {}) {
  const { emissive, emissiveIntensity } = extra;
  const m = new THREE.MeshToonMaterial({ color, gradientMap: TONES });
  if (emissive !== undefined) { m.emissive.setHex(emissive); m.emissiveIntensity = emissiveIntensity ?? 1; }
  return m;
}

/** Contour noir façon dessin animé (coque inversée un peu plus grosse). */
function outline(mesh, t = 0.0075) {
  const g = mesh.geometry;
  if (!g.boundingBox) g.computeBoundingBox();
  const s = new THREE.Vector3();
  g.boundingBox.getSize(s);
  const o = new THREE.Mesh(g, INK);
  o.scale.set(1 + 2 * t / (s.x * mesh.scale.x || 1), 1 + 2 * t / (s.y * mesh.scale.y || 1), 1 + 2 * t / (s.z * mesh.scale.z || 1));
  o.userData.ink = true;
  mesh.add(o);
  return mesh;
}

function limb(len, r, mat) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.001, len - r * 0.6), 6, 16), mat);
  m.position.y = -len / 2;
  m.castShadow = true;
  return outline(m);
}

function ellipsoid(sx, sy, sz, mat, ink = true) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), mat);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  return ink ? outline(m) : m;
}

function piece(geo, mat, ink = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  return ink ? outline(m, 0.005) : m;
}

const SKIN = { garcon: 0x8a5232, fille: 0x9a5e3a };

function buildBody(lookName) {
  const L = LOOKS[lookName] || LOOKS.garcon;
  const M = {
    skin: material(SKIN[lookName] || L.skin), top: material(L.top), bottom: material(L.bottom), shoe: material(L.shoe),
    sole: material(L.sole), hair: material(0x120c0a), white: material(0xffffff), dark: material(0x0a0a0d),
    green: material(0x7cff00, { emissive: 0x7cff00, emissiveIntensity: 0.45 }), lip: material(0x3d1610), iris: material(0x2a1608),
    stripe: material(lookName === 'fille' ? 0x7cff00 : 0xf2f4f8),
  };
  const zones = { cuisses: [], fessiers: [], abdos: [], pectoraux: [], dos: [], epaules: [], biceps: [], triceps: [], avantbras: [], mollets: [] };
  const meshes = [];
  const own = (m, zs = []) => { m.material = m.material.clone(); meshes.push(m); zs.forEach(z => zones[z].push(m)); return m; };
  const J = {};

  const root = new THREE.Group();
  root.rotation.order = 'YXZ';

  const pelvis = own(ellipsoid(L.hip + 0.078, 0.11, 0.118, M.bottom), ['fessiers']);
  pelvis.position.y = 0.01;
  root.add(pelvis);

  // buste : veste bleu marine, fermeture éclair et col verts
  const spine = new THREE.Group();
  spine.position.y = 0.05;
  root.add(spine);
  const abdo = own(ellipsoid(L.waist, 0.17, L.waist * 0.8, M.top), ['abdos']);
  abdo.position.y = 0.13;
  spine.add(abdo);
  const chest = own(ellipsoid(L.chestW, 0.2, L.chestD, M.top), ['pectoraux', 'dos']);
  chest.position.y = L.torso - 0.17;
  spine.add(chest);
  const zip = piece(new THREE.BoxGeometry(0.016, L.torso * 0.62, 0.014), M.green, false);
  zip.position.set(0, L.torso * 0.5, L.chestD * 0.97);
  spine.add(zip);
  const tee = ellipsoid(0.034, 0.022, 0.012, M.white, false);
  tee.position.set(0, L.torso - 0.03, L.chestD * 0.62);
  spine.add(tee);
  const collar = piece(new THREE.TorusGeometry(0.066, 0.017, 10, 28), M.green);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = L.torso - 0.005;
  spine.add(collar);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.052, 0.12, 16), M.skin);
  neck.position.y = L.torso + 0.01;
  spine.add(neck);
  meshes.push(neck);

  // tête de dessin animé : plus grosse, yeux, sourcils, sourire, casque audio
  const head = new THREE.Group();
  head.position.y = L.torso + 0.05;
  spine.add(head);
  const face = new THREE.Group();
  face.scale.setScalar(1.32);
  head.add(face);
  const skull = own(ellipsoid(0.1, 0.12, 0.106, M.skin));
  skull.position.y = 0.11;
  face.add(skull);
  for (const s of [1, -1]) {
    const ear = ellipsoid(0.018, 0.028, 0.014, M.skin);
    ear.position.set(s * 0.1, 0.105, 0);
    face.add(ear);
    const white = ellipsoid(0.022, 0.027, 0.012, M.white, false);
    white.position.set(s * 0.038, 0.122, 0.093);
    face.add(white);
    const iris = ellipsoid(0.013, 0.016, 0.008, M.iris, false);
    iris.position.set(s * 0.036, 0.12, 0.103);
    face.add(iris);
    const shine = ellipsoid(0.0045, 0.0045, 0.003, M.white, false);
    shine.position.set(s * 0.036 + 0.005, 0.127, 0.11);
    face.add(shine);
    const brow = piece(new THREE.CapsuleGeometry(0.006, 0.026, 4, 8), M.hair, false);
    brow.rotation.z = Math.PI / 2 + s * 0.18;
    brow.position.set(s * 0.038, 0.158, 0.098);
    face.add(brow);
  }
  const nose = ellipsoid(0.017, 0.013, 0.012, M.skin, false);
  nose.position.set(0, 0.1, 0.104);
  face.add(nose);
  const smile = piece(new THREE.TorusGeometry(0.028, 0.0065, 8, 20, Math.PI), M.lip, false);
  smile.rotation.z = Math.PI;
  smile.position.set(0, 0.083, 0.097);
  face.add(smile);
  const teeth = ellipsoid(0.02, 0.006, 0.004, M.white, false);
  teeth.position.set(0, 0.073, 0.1);
  face.add(teeth);
  // la bouche s'ouvre quand le coach parle
  const mouth = ellipsoid(0.021, 0.012, 0.006, M.lip, false);
  mouth.position.set(0, 0.068, 0.096);
  mouth.visible = false;
  face.add(mouth);

  // cheveux noirs
  const cap = piece(new THREE.SphereGeometry(0.108, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), M.hair);
  cap.position.set(0, 0.125, -0.006);
  cap.rotation.x = -0.32;
  face.add(cap);
  let pony = null;
  if (L.ponytail) {
    // fille : chignon bouclé haut (puff) avec chouchou vert
    pony = new THREE.Group();
    pony.position.set(0, 0.215, -0.06);
    face.add(pony);
    const band = piece(new THREE.TorusGeometry(0.03, 0.01, 8, 18), M.green);
    band.rotation.x = Math.PI / 2 - 0.5;
    pony.add(band);
    const puff = new THREE.Group();
    puff.position.set(0, 0.06, -0.025);
    pony.add(puff);
    [[0, 0, 0, 0.062], [0.045, 0.01, 0, 0.042], [-0.045, 0.012, 0, 0.042], [0, 0.045, 0, 0.045], [0, 0.005, -0.045, 0.045], [0.03, 0.04, -0.03, 0.036], [-0.03, 0.04, -0.03, 0.036], [0, -0.02, 0.035, 0.035]]
      .forEach(([x, y, z, r]) => { const c = ellipsoid(r, r, r, M.hair); c.position.set(x, y, z); puff.add(c); });
    for (const s of [1, -1]) {
      const side = ellipsoid(0.03, 0.05, 0.04, M.hair); side.position.set(s * 0.085, 0.14, -0.02); face.add(side);
      // cils et boucles d'oreilles
      for (const k of [0, 1]) {
        const lash = piece(new THREE.CapsuleGeometry(0.0035, 0.014, 3, 6), M.hair, false);
        lash.position.set(s * (0.052 + k * 0.007), 0.143 - k * 0.006, 0.098);
        lash.rotation.z = -s * (0.9 + k * 0.4);
        face.add(lash);
      }
      const hoop = piece(new THREE.TorusGeometry(0.014, 0.0035, 6, 16), material(0xffc83d), false);
      hoop.rotation.y = Math.PI / 2;
      hoop.position.set(s * 0.104, 0.074, 0.005);
      face.add(hoop);
    }
  } else {
    // garçon : coupe courte, un peu de volume devant
    [[0, 0.215, 0.03, 0.05], [0.042, 0.205, 0.045, 0.04], [-0.042, 0.205, 0.045, 0.04], [0, 0.2, -0.05, 0.06]]
      .forEach(([x, y, z, r]) => { const c = ellipsoid(r, r * 0.8, r, M.hair); c.position.set(x, y, z); face.add(c); });
  }
  // casque audio
  const arc = piece(new THREE.TorusGeometry(0.122, 0.01, 8, 28, Math.PI), M.dark);
  arc.position.set(0, 0.112, -0.01);
  face.add(arc);
  for (const s of [1, -1]) {
    const cup = piece(new THREE.CylinderGeometry(0.036, 0.036, 0.03, 20), M.dark);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(s * 0.115, 0.108, -0.005);
    face.add(cup);
    const ring = piece(new THREE.TorusGeometry(0.024, 0.005, 6, 20), M.green, false);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(s * 0.132, 0.108, -0.005);
    face.add(ring);
  }

  const hands = [];
  for (const side of ['l', 'r']) {
    const s = side === 'l' ? 1 : -1;
    const sh = new THREE.Group();
    sh.position.set(s * L.sh, L.torso - 0.07, 0);
    spine.add(sh);
    const delt = own(ellipsoid(L.armR * 1.4, L.armR * 1.4, L.armR * 1.4, M.top), ['epaules']);
    sh.add(delt);
    const longue = !L.sleeve; // la fille a des manches jusqu'au coude
    const ua = own(limb(L.ua, L.armR, longue ? M.top : M.skin), ['biceps', 'triceps']);
    sh.add(ua);
    const sleeveEnd = longue ? -L.ua + 0.01 : -0.13;
    if (!longue) {
      const sleeve = piece(new THREE.CylinderGeometry(L.armR * 1.25, L.armR * 1.18, 0.14, 18), M.top);
      sleeve.position.y = -0.06;
      sh.add(sleeve);
    }
    const band = piece(new THREE.TorusGeometry(L.armR * (longue ? 1.05 : 1.2), 0.009, 6, 20), M.green, false);
    band.rotation.x = Math.PI / 2;
    band.position.y = sleeveEnd;
    sh.add(band);
    const el = new THREE.Group();
    el.position.y = -L.ua;
    sh.add(el);
    el.add(own(limb(L.fa, L.armR * 0.85, M.skin), ['avantbras']));
    if (side === 'l') {
      const watch = piece(new THREE.CylinderGeometry(L.armR * 0.95, L.armR * 0.95, 0.032, 18), M.dark);
      watch.position.y = -L.fa + 0.035;
      el.add(watch);
      const screen = piece(new THREE.BoxGeometry(0.03, 0.026, 0.006), M.green, false);
      screen.position.set(0, -L.fa + 0.035, L.armR * 0.95);
      el.add(screen);
    }
    const hand = new THREE.Group();
    hand.position.y = -L.fa;
    el.add(hand);
    const palm = own(ellipsoid(0.042, 0.055, 0.032, M.skin));
    palm.position.y = -0.04;
    hand.add(palm);
    const thumb = ellipsoid(0.014, 0.024, 0.014, M.skin);
    thumb.position.set(-s * 0.03, -0.03, 0.016);
    thumb.rotation.z = -s * 0.5;
    hand.add(thumb);
    hands.push(palm);

    const hp = new THREE.Group();
    hp.position.set(s * L.hip, -0.03, 0);
    root.add(hp);
    hp.add(own(limb(L.th, L.legR, M.bottom), ['cuisses']));
    const st1 = piece(new THREE.BoxGeometry(0.008, L.th * 0.8, 0.022), M.stripe, false);
    st1.position.set(s * L.legR * 1.0, -L.th / 2, 0);
    hp.add(st1);
    const kn = new THREE.Group();
    kn.position.y = -L.th;
    hp.add(kn);
    const legging = L.shin !== 'skin';
    kn.add(own(limb(L.sn, L.legR * 0.72, legging ? M.bottom : M.skin), ['mollets']));
    if (legging) {
      const st2 = piece(new THREE.BoxGeometry(0.007, L.sn * 0.8, 0.02), M.stripe, false);
      st2.position.set(s * L.legR * 0.74, -L.sn / 2, 0);
      kn.add(st2);
    } else {
      const sock = piece(new THREE.CylinderGeometry(L.legR * 0.62, L.legR * 0.62, 0.06, 16), M.white);
      sock.position.y = -L.sn + 0.05;
      kn.add(sock);
    }
    const an = new THREE.Group();
    an.position.y = -L.sn;
    kn.add(an);
    const foot = own(new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.15, 6, 14), M.shoe));
    foot.rotation.x = Math.PI / 2;
    foot.position.set(0, -0.035, 0.065);
    foot.castShadow = true;
    outline(foot, 0.006);
    an.add(foot);
    const sole = piece(new THREE.BoxGeometry(0.085, 0.022, 0.235), M.sole);
    sole.position.set(0, -0.075, 0.065);
    an.add(sole);

    J[side + 'Sh'] = sh; J[side + 'El'] = el; J[side + 'Hand'] = hand;
    J[side + 'Hip'] = hp; J[side + 'Knee'] = kn; J[side + 'Ank'] = an;
  }

  return { root, spine, head, J, meshes, zones, hands, chest, abdo, pelvis, pony, mouth, L };
}

function applyPose(b, q) {
  const J = b.J;
  b.root.rotation.set(q.rx * D, q.ry * D, q.rz * D);
  b.spine.rotation.set(q.spine * D, q.spineY * D, q.spineZ * D);
  b.head.rotation.x = q.head * D;
  J.lSh.rotation.set(q.lSh * D, 0, q.lShA * D);
  J.rSh.rotation.set(q.rSh * D, 0, -q.rShA * D);
  J.lEl.rotation.x = q.lEl * D;
  J.rEl.rotation.x = q.rEl * D;
  J.lHip.rotation.set(q.lHip * D, 0, q.lHipA * D);
  J.rHip.rotation.set(q.rHip * D, 0, -q.rHipA * D);
  J.lKnee.rotation.x = q.lKnee * D;
  J.rKnee.rotation.x = q.rKnee * D;
  J.lAnk.rotation.x = q.lAnk * D;
  J.rAnk.rotation.x = q.rAnk * D;
}

// ---------- accessoires ----------
const METAL = () => material(0x9aa0aa, { metalness: 0.85, roughness: 0.28 });
const PLATE_COLORS = [0x7cff00, 0x0e1a33, 0x00c8ff, 0x13254a];

function dumbbell(color = 0x1b1b20) {
  const g = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.2, 10), METAL());
  bar.rotation.z = Math.PI / 2;
  g.add(bar);
  for (const s of [1, -1]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.055, 18), material(color, { roughness: 0.45 }));
    p.rotation.z = Math.PI / 2;
    p.position.x = s * 0.09;
    p.castShadow = true;
    g.add(p);
  }
  return g;
}

function barbell() {
  const g = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.9, 12), METAL());
  bar.rotation.z = Math.PI / 2;
  bar.castShadow = true;
  g.add(bar);
  for (const s of [1, -1]) {
    [[0.2, 0.05, 0], [0.16, 0.04, 1]].forEach(([r, w, c], i) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 28), material(PLATE_COLORS[c], { roughness: 0.4 }));
      p.rotation.z = Math.PI / 2;
      p.position.x = s * (0.66 + i * 0.055);
      p.castShadow = true;
      g.add(p);
    });
  }
  return g;
}

function kettlebell() {
  const g = new THREE.Group();
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 22, 16), material(0x7cff00, { roughness: 0.35 }));
  ball.position.y = -0.13;
  ball.castShadow = true;
  g.add(ball);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.014, 8, 20, Math.PI), material(0x18181d));
  handle.position.y = -0.05;
  handle.rotation.z = Math.PI;
  g.add(handle);
  return g;
}

function bench() {
  const g = new THREE.Group();
  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 1.15), material(0x1d1d24, { roughness: 0.6 }));
  pad.position.y = -0.035;
  pad.castShadow = true;
  pad.receiveShadow = true;
  g.add(pad);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.072, 1.152), material(0x7cff00, { emissive: 0x3a7a00, emissiveIntensity: 0.6 }));
  stripe.position.y = -0.035;
  g.add(stripe);
  g.userData.legs = [];
  for (const z of [-0.45, 0.45]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1, 0.06), METAL());
    leg.position.z = z;
    leg.castShadow = true;
    g.add(leg);
    g.userData.legs.push(leg);
  }
  return g;
}

function pullBar(H) {
  const g = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.5, 12), METAL());
  bar.rotation.z = Math.PI / 2;
  bar.position.y = H;
  g.add(bar);
  for (const s of [1, -1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, H + 0.1, 0.06), material(0x1d1d24));
    post.position.set(s * 0.75, (H + 0.1) / 2, 0);
    post.castShadow = true;
    g.add(post);
  }
  return g;
}

function mat() {
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.012, 1.9), material(0x0b1d38, { roughness: 0.95 }));
  m.position.y = 0.006;
  m.receiveShadow = true;
  return m;
}

// ---------- la scène ----------
const tmpBox = new THREE.Box3();
const bodyBox = new THREE.Box3();
const vA = new THREE.Vector3();
const vB = new THREE.Vector3();

export class Viewer {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.opts = opts;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: !!opts.thumb });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.thumb ? 1.5 : 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping; // couleurs franches de dessin animé

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.05, 60);

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x2a4060, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(2.4, 5, 3.4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -2.5, right: 2.5, top: 3, bottom: -2, near: 0.5, far: 14 });
    key.shadow.bias = -0.0004;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x00c8ff, 2.6);
    rim.position.set(-3, 2.6, -3.2);
    this.scene.add(rim);
    const fill = new THREE.DirectionalLight(0x7cff00, 0.45);
    fill.position.set(-3.2, 1.2, 2.2);
    this.scene.add(fill);

    const floor = new THREE.Mesh(new THREE.CircleGeometry(3.4, 72), material(0x07101f, { roughness: 0.92 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    const ring = new THREE.Mesh(new THREE.RingGeometry(3.3, 3.36, 96), new THREE.MeshBasicMaterial({ color: 0x7cff00 }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.003;
    this.scene.add(ring);
    const grid = new THREE.GridHelper(6.6, 22, 0x00c8ff, 0x16304f);
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    grid.position.y = 0.002;
    this.scene.add(grid);

    this.look = opts.look || 'garcon';
    this.body = null;
    this.ex = null;
    this.frames = null;
    this.props = new THREE.Group();
    this.scene.add(this.props);
    this.speed = 1;
    this.yaw = opts.yaw ?? 32;
    this.pitch = opts.pitch ?? 9;
    this.zoom = 1;
    this.target = new THREE.Vector3(0, 0.85, 0);
    this.dist = 4.2;
    this.smooth = false;
    this.cycles = 0;
    this.lastPhase = 0;
    this.onCycle = null;
    this.onBeat = null; // à chaque répétition terminée (2 par cycle pour les exercices en alternance)
    this.beats = 0;
    this.talking = false; // le coach parle : bouche et tête bougent
    this.talkAmt = 0;
    this.blend = null;
    this.lastQ = null;
    this.t0 = performance.now();
    this.paused = false;
    this.running = false;

    this.setLook(this.look);
    if (!opts.thumb) {
      this.bindDrag();
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(canvas);
      this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; if (this.visible) this.start(); });
      this.io.observe(canvas);
    }
    this.resize();
  }

  resize() {
    const w = this.canvas.clientWidth || this.opts.width || 300;
    const h = this.canvas.clientHeight || this.opts.height || 300;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  bindDrag() {
    const c = this.canvas;
    let drag = null;
    c.style.touchAction = 'pan-y';
    c.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yaw: this.yaw, pitch: this.pitch, id: e.pointerId }; c.setPointerCapture(e.pointerId); this.userTurned = true; });
    c.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      this.yaw = drag.yaw - (e.clientX - drag.x) * 0.45;
      this.pitch = Math.max(-5, Math.min(60, drag.pitch + (e.clientY - drag.y) * 0.3));
    });
    const end = () => { drag = null; };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('wheel', e => { e.preventDefault(); this.zoom = Math.max(0.55, Math.min(1.8, this.zoom * (e.deltaY > 0 ? 1.08 : 0.93))); }, { passive: false });
  }

  setView(name) {
    const v = { face: [0, 8], profil: [90, 6], dos: [180, 10], trois: [32, 9], dessus: [32, 48] }[name];
    if (v) { this.yaw = v[0]; this.pitch = v[1]; }
  }

  setLook(look) {
    this.look = LOOKS[look] ? look : 'garcon';
    if (this.body) this.scene.remove(this.body.root);
    this.body = buildBody(this.look);
    this.scene.add(this.body.root);
    if (this.ex) this.setExercise(this.ex);
  }

  setExercise(ex) {
    const from = !this.opts.thumb && this.ex && this.lastQ && Object.values(this.lastQ).every(Number.isFinite) ? this.lastQ : null;
    this.ex = ex;
    this.frames = ex.anim.frames.map(expand);
    this.t0 = performance.now();
    this.cycles = 0;
    this.beats = 0;
    this.lastPhase = 0;
    this.blend = null;
    this.buildProps();
    this.highlight(ex.zones || []);
    // passage en douceur de l'ancienne position à la nouvelle (pas de saut d'un exercice à l'autre)
    this.blend = from ? { from, t0: performance.now() } : null;
    if (!from) this.smooth = false;
  }

  highlight(zs) {
    this.hl = [];
    for (const m of this.body.meshes) { m.material.emissive.setHex(0x000000); m.material.emissiveIntensity = 0; }
    const set = new Set();
    for (const z of zs) {
      if (z === 'cardio') { ['cuisses', 'mollets', 'fessiers'].forEach(k => this.body.zones[k].forEach(m => set.add(m))); continue; }
      (this.body.zones[z] || []).forEach(m => set.add(m));
    }
    for (const m of set) { m.material.emissive.setHex(0x5cff00); this.hl.push(m); }
  }

  buildProps() {
    this.props.clear();
    for (const b of [this.body]) for (const k of ['lHand', 'rHand']) b.J[k].children.filter(c => c.userData.prop).forEach(c => b.J[k].remove(c));
    this.body.spine.children.filter(c => c.userData.prop).forEach(c => this.body.spine.remove(c));
    this.body.root.children.filter(c => c.userData.prop).forEach(c => this.body.root.remove(c));
    this.live = {};
    const props = this.ex.anim.props || [];
    const b = this.body;
    if (props.includes('halteres')) {
      for (const k of ['lHand', 'rHand']) { const d = dumbbell(); d.position.y = -0.045; d.userData.prop = true; b.J[k].add(d); }
    }
    if (props.includes('barre')) { this.live.bar = barbell(); this.props.add(this.live.bar); }
    if (props.includes('kettlebell')) { this.live.kb = kettlebell(); this.props.add(this.live.kb); }
    if (props.includes('barre-dos')) {
      const bb = barbell();
      bb.position.set(0, b.L.torso - 0.03, -0.11);
      bb.userData.prop = true;
      b.spine.add(bb);
    }
    if (props.includes('barre-hanches')) {
      const bb = barbell();
      bb.position.set(0, 0.0, 0.16);
      bb.userData.prop = true;
      b.root.add(bb);
    }
    if (props.includes('barre-traction')) this.props.add(pullBar(this.ex.anim.H || 2.15));
    // pose de départ : sert à placer le banc et le tapis
    this.pose(0);
    if (props.includes('banc')) {
      tmpBox.makeEmpty();
      tmpBox.expandByObject(b.chest, true).expandByObject(b.abdo, true).expandByObject(b.pelvis, true);
      const top = tmpBox.min.y;
      const bn = bench();
      bn.position.set(0, top, (tmpBox.min.z + tmpBox.max.z) / 2 - 0.05);
      bn.userData.legs.forEach(l => { l.scale.y = top - 0.07; l.position.y = -0.07 - (top - 0.07) / 2; });
      this.props.add(bn);
    }
    if (props.includes('tapis')) {
      const t = mat();
      t.position.x = (bodyBox.min.x + bodyBox.max.x) / 2;
      t.position.z = (bodyBox.min.z + bodyBox.max.z) / 2;
      this.props.add(t);
    }
  }

  /** Place le corps à la phase donnée (0 → 1) et met à jour accessoires et cadrage. */
  pose(phase) {
    const b = this.body;
    let q = sample(this.ex.anim, phase, this.frames);
    if (this.blend) {
      const k = Math.min(1, (performance.now() - this.blend.t0) / 650);
      if (k >= 1) this.blend = null;
      else q = lerpPose(this.blend.from, q, k * k * (3 - 2 * k));
    }
    this.lastQ = q;
    applyPose(b, q);
    b.root.position.set(0, 1.3, 0);
    b.root.updateMatrixWorld(true);
    bodyBox.makeEmpty();
    for (const m of b.meshes) { tmpBox.setFromObject(m, true); bodyBox.union(tmpBox); }
    let dy;
    if (this.ex.anim.mode === 'hang') {
      let top = -Infinity;
      for (const h of b.hands) { tmpBox.setFromObject(h, true); top = Math.max(top, tmpBox.max.y); }
      dy = (this.ex.anim.H || 2.15) + 0.02 - top;
    } else {
      dy = -bodyBox.min.y + 0.002 + (q.lift || 0);
    }
    b.root.position.y += dy;
    bodyBox.min.y += dy;
    bodyBox.max.y += dy;
    b.root.updateMatrixWorld(true);
    if (b.pony) b.pony.rotation.x = 0.45 + Math.sin(phase * Math.PI * 4) * 0.12 - (q.spine + q.rx) * D * 0.6;
    if (this.live.bar || this.live.kb) {
      b.J.lHand.getWorldPosition(vA);
      b.J.rHand.getWorldPosition(vB);
      vA.add(vB).multiplyScalar(0.5);
      if (this.live.bar) this.live.bar.position.set(0, vA.y - 0.04, vA.z);
      if (this.live.kb) this.live.kb.position.copy(vA);
    }
    return q;
  }

  frame(now) {
    if (!this.ex) return;
    const dur = (this.ex.anim.dur || 2) / this.speed;
    // l'heure de l'image peut précéder de quelques ms le changement d'exercice : on ne descend jamais sous 0
    const t = Math.max(0, (this.paused ? this.pausedAt : (now - this.t0) / 1000) || 0);
    const phase = (t / dur) % 1;
    if (!this.paused && phase < this.lastPhase) { this.cycles++; this.onCycle && this.onCycle(this.cycles); }
    const beat = Math.floor((t / dur) * (this.ex.reps2 ? 2 : 1));
    if (!this.paused && beat > this.beats) { this.beats = beat; this.onBeat && this.onBeat(beat); }
    this.lastPhase = phase;
    this.pose(phase);
    this.alive(now);
    const pulse = 0.22 + 0.2 * Math.sin(now / 260);
    for (const m of this.hl) m.material.emissiveIntensity = pulse;
    this.place(this.smooth ? 0.06 : 1);
    this.smooth = true;
    if (this.opts.spin && !this.userTurned) this.yaw += 0.08;
    this.renderer.render(this.scene, this.camera);
  }

  /** Petits gestes de vie : il respire, et quand il parle sa bouche s'ouvre et sa tête accompagne la phrase. */
  alive(now) {
    const b = this.body;
    const s = now / 1000;
    this.talkAmt += ((this.talking ? 1 : 0) - this.talkAmt) * 0.18;
    b.spine.rotation.x += Math.sin(s * 1.9) * 0.006;
    if (b.mouth) {
      const open = this.talkAmt * Math.abs(Math.sin(s * 15.5)) * (0.55 + 0.45 * Math.sin(s * 5.3));
      b.mouth.visible = open > 0.06;
      b.mouth.scale.y = 0.003 + 0.011 * open;
    }
    b.head.rotation.x += this.talkAmt * Math.sin(s * 4.6) * 0.045;
    b.head.rotation.z = this.talkAmt * Math.sin(s * 2.7) * 0.05;
  }

  place(k) {
    const c = new THREE.Vector3();
    bodyBox.getCenter(c);
    const size = new THREE.Vector3();
    bodyBox.getSize(size);
    const extent = Math.max(size.y, size.z * 0.9, size.x, 1.25);
    if (!Number.isFinite(extent) || !Number.isFinite(c.x + c.y + c.z)) return; // image ratée : on garde le cadrage
    if (!Number.isFinite(this.dist) || !Number.isFinite(this.target.x + this.target.y + this.target.z)) { this.dist = 4.2; this.target.copy(c); }
    this.target.lerp(c, k);
    this.dist += ((1.9 + extent * 1.95) * this.zoom - this.dist) * k;
    const y = this.yaw * D, p = this.pitch * D;
    this.camera.position.set(
      this.target.x + Math.sin(y) * Math.cos(p) * this.dist,
      this.target.y + Math.sin(p) * this.dist + 0.15,
      this.target.z + Math.cos(y) * Math.cos(p) * this.dist,
    );
    this.camera.lookAt(this.target);
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = now => {
      if (!this.running) return;
      if (this.opts.thumb || this.visible === false || document.hidden || !this.canvas.isConnected) { this.running = false; return; }
      this.frame(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  setPaused(p) {
    if (p === this.paused) return;
    if (p) { this.pausedAt = (performance.now() - this.t0) / 1000; this.paused = true; }
    else { this.t0 = performance.now() - (this.pausedAt || 0) * 1000; this.paused = false; }
  }

  /** Image fixe d'un exercice (vignettes de la liste). */
  snapshot(ex, phase) {
    this.setExercise(ex);
    this.pose(phase);
    for (const m of this.hl) m.material.emissiveIntensity = 0.38;
    this.place(1);
    this.renderer.render(this.scene, this.camera);
    return this.canvas.toDataURL('image/png');
  }
}

document.addEventListener('visibilitychange', () => { if (!document.hidden) window.dispatchEvent(new Event('jacksport-wake')); });
