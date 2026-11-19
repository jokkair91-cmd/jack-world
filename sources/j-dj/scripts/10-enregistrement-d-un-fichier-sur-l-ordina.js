/* ---------- Enregistrement d'un fichier sur l'ordinateur (WAV, sauvegarde) ---------- */
const hasClaude = !!(window.claude && typeof window.claude.use === 'function');
const dlPromise = hasClaude ? Promise.resolve(window.claude.use('downloads')).catch(() => null) : Promise.resolve(undefined);
async function saveFile(blob, filename) {
  const dl = await dlPromise;
  if (dl) {
    try { await dl.save({ filename, data: blob }); return 'ok'; }
    catch (err) { const code = err && err.code; return code === 'declined' ? 'declined' : code === 'rate_limited' ? 'later' : 'error'; }
  }
  if (dl === undefined) {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000); return 'ok';
  }
  return 'error';
}
const stampNow = () => { const n = new Date(), p2 = v => String(v).padStart(2, '0'); return `${n.getFullYear()}-${p2(n.getMonth() + 1)}-${p2(n.getDate())}-${p2(n.getHours())}h${p2(n.getMinutes())}m${p2(n.getSeconds())}s`; };

