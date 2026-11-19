
(() => {
'use strict';
const AC = window.AudioContext || window.webkitAudioContext;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmt = s => { if (!isFinite(s) || s < 0) s = 0; const m = Math.floor(s / 60), ss = Math.floor(s % 60); return m + ':' + String(ss).padStart(2, '0'); };
const PADS = ['#e5483d', '#e9a514', '#2fae5e', '#8566ec'];
const LOOPS = [0.5, 1, 2, 4, 8, 16], ROLLS = [0.25, 0.5, 1, 2];
const FX_ORDER = ['filtre', 'gate', 'crush', 'flanger', 'echo', 'reverb'], FX_INSERT = ['filtre', 'gate', 'crush'];
const FX_UI = [['echo', 'Écho'], ['flanger', 'Flanger'], ['reverb', 'Réverb'], ['crush', 'Bitcrusher'], ['gate', 'Gate'], ['filtre', 'Filtre auto']];
const beatLbl = b => b === 0.5 ? '½' : b === 0.25 ? '¼' : String(b);
// capture du pointeur tolérante (un pointeur inconnu ne doit pas bloquer la commande)
const capture = (el, e) => { el.dataset.drag = String(e.pointerId); try { el.setPointerCapture(e.pointerId); } catch (err) {} };
const fmtPrecise =s => { const m = Math.floor(s / 60); return m + ':' + (s - m * 60).toFixed(2).padStart(5, '0').replace('.', ','); };

