(() => {
 'use strict';
 // Principe : la console du studio sait créer un canal (égaliseur, compresseur, pan, volume, départ réverbération, + rack d'effets
 // et courbes) pour n'importe quel nom. Chaque piste audio « aud_… » reçoit son canal DÈS QU'ELLE A UN RÉGLAGE À ELLE
 // (rack d'effets, courbe, ou réglage de canal). Sans réglage, elle reste sur le canal commun « Audio importé » : le son des
 // projets existants ne change pas d'un bit.
 const A = () => window.JACK22_AUDIO_EDIT, P = () => window.JACK22_PRODUCTION, Rk = () => window.JACK22_RACKS, Au = () => window.JACK22_AUTOMATION;
 const say = t => { try { audioMsg(t); } catch (e) { try { setStatus(t); } catch (x) {} } };
 const lanes = () => (A()?.settings?.tracks || []).filter(t => /^aud_[a-z0-9]{1,40}$/.test(t.id));
 window.J22AudioChannels = () => lanes().map(t => [t.id, '♪ ' + t.name]);
 const has = id => {
  try {
   const r = Rk()?.settings, au = Au()?.settings, mix = P()?.config?.mix || {};
   return !!((r?.chains?.[id]?.length) || (r?.sends?.[id]?.length) || mix[id] || (au && JSON.stringify(au).includes('"' + id + '"')));
  } catch (e) { return false; }
 };
 // Moteur de chaque contexte audio (lecture en direct ET rendu de l'export), pour y créer le canal de la piste.
 const engines = new WeakMap();
 const ce0 = createEngine;
 createEngine = function (ctx) { const E = ce0.apply(this, arguments); try { engines.set(ctx, E); } catch (e) {} return E; };
 try { if (typeof engine !== 'undefined' && engine && audio) engines.set(audio, engine); } catch (e) {}   // moteur déjà créé avant ce bloc
 const node0 = window.J97AudioNode;
 window.J97AudioNode = (ctx, c, fallback) => {
  try {
   const lane = A()?.lane(c.id), E = engines.get(ctx);
   if (lane && /^aud_/.test(lane) && E?.productionNode && has(lane) && !P()?.config?.clips?.[c.id]?.mute) return E.productionNode(lane, true, undefined, lane);
  } catch (e) {}
  return node0(ctx, c, fallback);
 };
 // Bouton « FX » sur chaque piste audio : ouvre le rack d'effets de cette piste (chaîne vide au départ, rien ne change tant qu'on n'ajoute rien).
 const deco = () => {
  for (const row of document.querySelectorAll('#timeline [data-j99-lane^="aud_"]')) {
   const id = row.dataset.j99Lane, lab = row.parentElement?.querySelector('.j99LaneLabel'); if (!lab) continue;
   let b = lab.querySelector('.c147Fx');
   if (!b) { b = document.createElement('button'); b.type = 'button'; b.className = 'c147Fx'; b.textContent = 'FX'; b.addEventListener('click', e => { e.stopPropagation(); try { Rk().open(id); } catch (err) { say('Racks indisponibles : ' + err.message); } }, true); lab.append(b); }
   const on = has(id); b.classList.toggle('on', on); b.title = on ? 'Effets et courbes de cette piste (actifs)' : 'Ajouter des effets à cette piste (égaliseur, compresseur, delay…)';
   b.setAttribute('aria-label', 'Effets de la piste ' + (lanes().find(t => t.id === id)?.name || ''));
  }
 };
 const build0 = tlBuild; tlBuild = function () { const r = build0.apply(this, arguments); try { deco(); } catch (e) {} return r; };
 document.addEventListener('close', e => { if (e.target?.id === 'j100Dialog' || e.target?.id === 'j101Dialog') setTimeout(() => { try { tlBuild(); } catch (x) {} }, 50); }, true);
 document.addEventListener('DOMContentLoaded', () => { try { deco(); } catch (e) {} }); setTimeout(deco, 800); // prêt dès l'ouverture (Jack World)
 window.JACK22_CONSOLE147 = { version: '11.5-claude-7.6-console-pistes', has, channels: window.J22AudioChannels };
})();