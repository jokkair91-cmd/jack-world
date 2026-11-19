(() => {
 'use strict';
 // Principe : « Export séparé » rend déjà un fichier par clip audio (audio-<id>.wav). Avec l'option « Un fichier par piste
 // audio » cochée, les clips sont groupés par piste du montage (AUDIO, VOIX 1 à 3, pistes ajoutées) : un fichier par piste,
 // nommé comme elle, avec ses effets (rack et courbes de la 7.6) puisque le rendu passe par le même chemin que l'export WAV.
 // Option éteinte (par défaut) : rien ne change, un fichier par clip comme avant.
 const KEY = 'jack22.c148.stemsByTrack';
 const A = () => window.JACK22_AUDIO_EDIT;
 let on = false; try { on = localStorage.getItem(KEY) === '1'; } catch (e) {}
 const set = v => { on = !!v; try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {} return on; };
 const safe = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9 _-]+/g, '').trim().replace(/\s+/g, '-').slice(0, 40) || 'piste';
 // [[nom de fichier sans .wav, [clips]], …] dans l'ordre des pistes du montage ; null si l'option est éteinte.
 const groups = clips => {
  if (!on) return null;
  const tracks = A()?.settings?.tracks || [], by = new Map();
  for (const c of clips) { let lane = 'audio'; try { lane = A()?.lane(c.id) || 'audio'; } catch (e) {} if (!by.has(lane)) by.set(lane, []); by.get(lane).push(c); }
  const order = [...tracks.map(t => t.id).filter(id => by.has(id)), ...[...by.keys()].filter(id => !tracks.some(t => t.id === id))];
  return order.map((id, i) => { const t = tracks.find(x => x.id === id); return ['piste-' + String(i + 1).padStart(2, '0') + '-' + safe(t?.name || id), by.get(id)]; });
 };
 window.J22StemGroups = groups;
 // Case à cocher sous « Exporter les pistes séparées en ZIP ».
 const deco = () => {
  const body = document.getElementById('j97Body'); if (!body) return;
  const b = [...body.querySelectorAll('button')].find(x => x.textContent.trim() === 'Exporter les pistes séparées en ZIP');
  if (!b || body.querySelector('.c148Opt')) return;
  const l = document.createElement('label'); l.className = 'c148Opt';
  l.innerHTML = '<input type="checkbox" id="c148ByTrack"> Un fichier par piste audio du montage (au lieu d’un fichier par clip)';
  const i = l.querySelector('input'); i.checked = on; i.addEventListener('change', () => set(i.checked));
  b.after(l);
 };
 try { const body = document.getElementById('j97Body'); if (body) new MutationObserver(deco).observe(body, { childList: true }); } catch (e) {}
 window.JACK22_STEMS148 = { version: '11.5-claude-7.7-stems-pistes', get on() { return on; }, set, groups };
})();