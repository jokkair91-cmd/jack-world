/* ---------- Mix recording ---------- */
const recBtn = document.getElementById('recBtn'), recLabel = document.getElementById('recLabel');
const recTime = document.getElementById('recTime'), dlBtn = document.getElementById('dlBtn'), recMsg = document.getElementById('recMsg');
let mixBlob = null;
const mixExt = 'wav';
const say = t => { recMsg.textContent = t; };
// WAV PCM 16 bits stéréo : en-tête RIFF de 44 octets + échantillons entrelacés
function wavHeader(frames, sr) {
  const bytes = frames * 4, h = new DataView(new ArrayBuffer(44));
  const str = (o, s) => { for (let i = 0; i < s.length; i++) h.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); h.setUint32(4, 36 + bytes, true); str(8, 'WAVE');
  str(12, 'fmt '); h.setUint32(16, 16, true); h.setUint16(20, 1, true); h.setUint16(22, 2, true);
  h.setUint32(24, sr, true); h.setUint32(28, sr * 4, true); h.setUint16(32, 4, true); h.setUint16(34, 16, true);
  str(36, 'data'); h.setUint32(40, bytes, true);
  return h.buffer;
}
function encodeWAV(chunks, frames, sr) { return new Blob([wavHeader(frames, sr), ...chunks], { type: 'audio/wav' }); }

