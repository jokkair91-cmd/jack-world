'use strict';
// AI JACK (édition Jack World) : l'IA tourne directement dans le navigateur grâce à WebLLM (WebGPU).
// Gratuit, sans compte. Le cerveau se télécharge une fois, puis marche sans Internet.
const $ = id => document.getElementById(id);
const STORE = 'ai-jack-web-v1';
const WEBLLM_URL = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.89/+esm';

// ---------- Mémoire (dans ce navigateur) ----------
let state = {chats: [], currentId: null, size: 'rapide', voice: '', autoSpeak: false};
function cleanChat(chat) {
  if (!chat || typeof chat.id !== 'string' || !Array.isArray(chat.messages)) return null;
  const messages = chat.messages
    .filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content)
    .map(m => ({role: m.role, content: m.content}));
  if (!messages.length) return null;
  const title = typeof chat.title === 'string' && chat.title ? chat.title : messages[0].content;
  return {id: chat.id, title: title.replace(/\s+/g, ' ').slice(0, 80), messages, updated: Number(chat.updated) || Date.now()};
}
try {
  const saved = JSON.parse(localStorage.getItem(STORE));
  if (saved && Array.isArray(saved.chats)) state = {...state, ...saved, chats: saved.chats.map(cleanChat).filter(Boolean)};
} catch {}
if (!['leger', 'rapide', 'malin'].includes(state.size)) state.size = 'rapide';
if (!state.chats.some(c => c.id === state.currentId)) state.currentId = null;
function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch {} }
const currentChat = () => state.chats.find(c => c.id === state.currentId) || null;

// ---------- Mise en forme des réponses (Markdown simple et sûr) ----------
const ICON_COPY = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';
const ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
const ICON_SOUND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
const esc = s => s.replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
function inline(text) {
  return text.split(/(`[^`\n]+`)/).map((part, i) => {
    if (i % 2) return '<code>' + esc(part.slice(1, -1)) + '</code>';
    return esc(part)
      .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  }).join('');
}
function codeBlock(lang, code) {
  return '<div class="codeBlock"><div class="codeHead"><span>' + esc(lang || 'code') + '</span>' +
    '<button type="button" class="copyCode">' + ICON_COPY + '<span>Copier</span></button></div>' +
    '<pre><code>' + esc(code) + '</code></pre></div>';
}
const LIST = /^\s*([-*+]|\d+[.)])\s+/;
function markdown(src) {
  const lines = src.replace(/\r/g, '').split('\n');
  let html = '', para = [], i = 0;
  const flush = () => { if (para.length) { html += '<p>' + para.map(inline).join('<br>') + '</p>'; para = []; } };
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^\s*```\s*([\w+#.-]*)/);
    if (fence) {
      flush();
      const code = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) code.push(lines[i++]);
      i++;
      html += codeBlock(fence[1], code.join('\n'));
      continue;
    }
    if (!line.trim()) { flush(); i++; continue; }
    const heading = line.match(/^(#{1,6})\s+(.*)/);
    if (heading) { flush(); const n = heading[1].length === 1 ? 2 : 3; html += `<h${n}>` + inline(heading[2]) + `</h${n}>`; i++; continue; }
    if (/^\s*(?:---|\*\*\*|___)\s*$/.test(line)) { flush(); html += '<hr>'; i++; continue; }
    if (/^\s*>/.test(line)) {
      flush();
      const quote = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, ''));
      html += '<blockquote>' + quote.map(inline).join('<br>') + '</blockquote>';
      continue;
    }
    if (LIST.test(line)) {
      flush();
      const ordered = /^\s*\d/.test(line);
      const items = [];
      while (i < lines.length && LIST.test(lines[i])) {
        items.push(lines[i++].replace(LIST, ''));
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !LIST.test(lines[i])) items[items.length - 1] += ' ' + lines[i++].trim();
      }
      const tag = ordered ? 'ol' : 'ul';
      html += `<${tag}>` + items.map(t => '<li>' + inline(t) + '</li>').join('') + `</${tag}>`;
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1] || '')) {
      flush();
      const cells = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
      html += '<table><thead><tr>' + head.map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>' +
        rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
      continue;
    }
    para.push(line);
    i++;
  }
  flush();
  return html;
}

// ---------- Affichage ----------
const scroller = $('scroller');
const nearBottom = () => scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 120;
const toBottom = () => { scroller.scrollTop = scroller.scrollHeight; };
function messageElement(message) {
  const box = document.createElement('div');
  if (message.role === 'user') {
    box.className = 'msg user';
    box.textContent = message.content;
    return box;
  }
  box.className = 'msg jack';
  const body = document.createElement('div');
  body.className = 'body';
  body.innerHTML = markdown(message.content);
  const actions = document.createElement('div');
  actions.className = 'actions';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.innerHTML = ICON_COPY + '<span>Copier</span>';
  copy.onclick = () => copyText(message.content, copy);
  const listen = document.createElement('button');
  listen.type = 'button';
  listen.innerHTML = ICON_SOUND + '<span>Écouter</span>';
  listen.onclick = () => speaking ? stopVoice() : speak(message.content);
  actions.append(copy, listen);
  box.append(body, actions);
  return box;
}
function render() {
  const chat = currentChat();
  $('messages').replaceChildren(...(chat?.messages || []).map(messageElement));
  document.body.classList.toggle('hasChat', !!chat?.messages.length);
  toBottom();
}
async function copyText(text, button) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const area = document.createElement('textarea');
    area.value = text; document.body.append(area); area.select();
    document.execCommand('copy'); area.remove();
  }
  const label = button.querySelector('span');
  const before = label.textContent;
  const iconBefore = button.querySelector('svg').outerHTML;
  button.querySelector('svg').outerHTML = ICON_CHECK;
  label.textContent = 'Copié';
  setTimeout(() => { button.querySelector('svg').outerHTML = iconBefore; label.textContent = before; }, 1500);
}
$('messages').addEventListener('click', event => {
  const button = event.target.closest('.copyCode');
  if (button) copyText(button.closest('.codeBlock').querySelector('code').textContent, button);
});

// ---------- Le cerveau de Jack (WebLLM, dans le navigateur) ----------
// Pour chaque taille, on prend le premier modèle disponible de la liste WebLLM (les noms changent avec les versions).
const SIZES = {
  leger: [/^Qwen3-0\.6B/, /^Qwen2\.5-0\.5B-Instruct/, /^Llama-3\.2-1B-Instruct/],
  rapide: [/^Qwen3-1\.7B/, /^Qwen2\.5-1\.5B-Instruct/, /^gemma-2-2b-it/, /^Llama-3\.2-1B-Instruct/],
  malin: [/^Qwen3-4B/, /^Qwen2\.5-3B-Instruct/, /^Llama-3\.2-3B-Instruct/, /^Phi-3\.5-mini-instruct/]
};
let webllm = null;
let gpu = undefined;
let engine = null;
let engineModel = '';
let loading = null;
async function library() {
  if (!webllm) webllm = await import(WEBLLM_URL);
  return webllm;
}
async function gpuSupport() {
  if (gpu !== undefined) return gpu;
  gpu = null;
  try {
    const adapter = navigator.gpu && await navigator.gpu.requestAdapter();
    if (adapter) gpu = {f16: adapter.features.has('shader-f16')};
  } catch {}
  return gpu;
}
function pickModel(list, size, f16) {
  const quant = f16 ? 'q4f16_1' : 'q4f32_1';
  for (const pattern of SIZES[size]) {
    const found = list.find(m => pattern.test(m.model_id) && m.model_id.includes(quant) && !/-1k$/.test(m.model_id));
    if (found) return found;
  }
  return null;
}
async function chosenModel(size = state.size) {
  const lib = await library();
  const support = await gpuSupport();
  if (!support) return null;
  const list = lib.prebuiltAppConfig.model_list;
  return pickModel(list, size, support.f16) || pickModel(list, size, false);
}
const gigas = model => model?.vram_required_MB ? (Math.max(0.4, model.vram_required_MB / 1024)).toFixed(1).replace('.', ',') + ' Go' : '1 Go environ';

// Zone au-dessus de la barre d'écriture : télécharger, progression, erreurs.
function setup({text = '', progress = null, button = '', onClick = null} = {}) {
  $('setup').hidden = !text;
  $('setupText').textContent = text;
  $('setupBar').hidden = progress === null;
  if (progress !== null) $('setupFill').style.width = Math.round(progress * 100) + '%';
  $('setupButton').hidden = !button;
  $('setupButton').textContent = button;
  $('setupButton').onclick = onClick;
}
async function prepare({download = false} = {}) {
  setup({text: 'Jack se prépare…'});
  let model;
  try {
    model = await chosenModel();
  } catch {
    setup({text: 'Impossible de charger le moteur de Jack. Vérifie ta connexion la première fois, puis recharge la page.', button: 'Réessayer', onClick: () => prepare()});
    return false;
  }
  if (!model) {
    setup({text: 'Ton navigateur ne peut pas faire tourner l’IA (WebGPU absent). Ouvre AI JACK dans Edge ou Chrome à jour, sur ordinateur.'});
    $('brainBadge').textContent = 'IA indisponible';
    return false;
  }
  if (engine && engineModel === model.model_id) { setup(); return true; }
  const lib = await library();
  let cached = false;
  try { cached = await lib.hasModelInCache(model.model_id); } catch {}
  if (!cached && !download) {
    setup({
      text: 'Pour discuter, Jack doit télécharger son cerveau une seule fois (jusqu’à ' + gigas(model) + '). Ensuite, il marche gratuitement et sans Internet.',
      button: 'Télécharger le cerveau de Jack', onClick: () => prepare({download: true})
    });
    $('brainBadge').textContent = 'Cerveau à télécharger';
    return false;
  }
  return loadEngine(model, cached);
}
function loadEngine(model, cached) {
  if (loading) return loading;
  loading = (async () => {
    const lib = await library();
    setup({text: cached ? 'Jack se réveille…' : 'Téléchargement du cerveau de Jack…', progress: 0});
    try {
      if (engine) { await engine.unload(); engine = null; engineModel = ''; }
      engine = await lib.CreateMLCEngine(model.model_id, {
        initProgressCallback: report => {
          const pct = Math.round((report.progress || 0) * 100);
          setup({text: (cached ? 'Jack se réveille… ' : 'Téléchargement du cerveau de Jack… ') + pct + ' %', progress: report.progress || 0});
        }
      });
      engineModel = model.model_id;
      setup();
      $('brainBadge').textContent = 'Sans Internet';
      return true;
    } catch (error) {
      engine = null;
      engineModel = '';
      const raw = String(error?.message || error);
      const text = /quota|storage/i.test(raw) ? 'Plus assez de place dans le navigateur pour le cerveau de Jack. Libère de l’espace ou choisis « Léger » dans les réglages.'
        : /fetch|network/i.test(raw) ? 'Le téléchargement a été coupé. Vérifie ta connexion puis réessaie : il reprendra où il en était.'
        : 'Jack n’a pas pu démarrer : ' + raw.slice(0, 160);
      setup({text, button: 'Réessayer', onClick: () => prepare({download: true})});
      return false;
    } finally {
      loading = null;
    }
  })();
  return loading;
}
const hideThinking = text => text.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').replace(/^\s+/, '');
function instructions() {
  const now = new Date();
  return 'Tu es AI JACK, un petit robot assistant sympa et franc. Réponds toujours en français et tutoie la personne. ' +
    'Va droit au but : réponses courtes et claires, sauf si on te demande des détails. ' +
    'Pour du code, donne un code complet dans un bloc ```langage puis explique en 2 ou 3 lignes comment le lancer. ' +
    'Si tu ne sais pas, dis-le simplement et n’invente rien. Tu n’as pas accès à Internet : tu ne connais pas l’actualité récente. ' +
    'Nous sommes le ' + now.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}) + '.';
}

// ---------- Discussion ----------
let busy = false;
let stopped = false;
function setBusy(value) {
  busy = value;
  document.body.classList.toggle('thinking', value);
  $('send').setAttribute('aria-label', value ? 'Arrêter la réponse' : 'Envoyer');
  $('send').title = value ? 'Arrêter la réponse' : 'Envoyer';
}
function showError(chat, message) {
  const box = document.createElement('div');
  box.className = 'error';
  box.textContent = message + ' ';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = 'Réessayer';
  retry.onclick = () => { box.remove(); reply(chat); };
  box.append(retry);
  $('messages').append(box);
  toBottom();
}
async function reply(chat) {
  if (busy) return;
  setBusy(true);
  stopped = false;
  const live = document.createElement('div');
  live.className = 'msg jack';
  live.innerHTML = '<p class="status"></p><div class="body"><span class="typing"><i></i><i></i><i></i></span></div>';
  $('messages').append(live);
  toBottom();
  let partial = '';
  let frame = 0;
  try {
    if (!engine) {
      live.querySelector('.status').textContent = 'Jack se réveille…';
      const ready = await prepare();
      if (!ready) { live.remove(); return; }
    }
    // Les petits cerveaux ont peu de mémoire : on leur envoie seulement la fin de la discussion.
    const history = chat.messages.slice(-8).map(({role, content}, index, all) =>
      ({role, content: index < all.length - 1 ? content.slice(0, 1500) : content.slice(0, 6000)}));
    while (history.length && history[0].role !== 'user') history.shift();
    const request = {messages: [{role: 'system', content: instructions()}, ...history], stream: true, temperature: 0.6, max_tokens: 1500};
    if (/^Qwen3/.test(engineModel)) request.extra_body = {enable_thinking: false};
    const stream = await engine.chat.completions.create(request);
    let text = '';
    for await (const chunk of stream) {
      const piece = chunk.choices?.[0]?.delta?.content;
      if (!piece) continue;
      text += piece;
      partial = hideThinking(text);
      if (frame) continue;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!partial) { live.querySelector('.status').textContent = 'Jack réfléchit…'; return; }
        const stick = nearBottom();
        live.querySelector('.status').textContent = '';
        live.querySelector('.body').innerHTML = markdown(partial);
        if (stick) toBottom();
      });
    }
    cancelAnimationFrame(frame);
    const answer = hideThinking(text).trim();
    if (!answer) throw Error(stopped ? 'stop' : 'Jack n’a rien répondu. Réessaie.');
    chat.messages.push({role: 'assistant', content: answer + (stopped ? '\n\n*(réponse arrêtée)*' : '')});
    chat.updated = Date.now();
    save();
    live.replaceWith(messageElement(chat.messages.at(-1)));
    if (state.autoSpeak && !stopped) speak(answer);
  } catch (error) {
    cancelAnimationFrame(frame);
    live.remove();
    if (error.message !== 'stop') {
      const raw = String(error?.message || error);
      const text = /context|token/i.test(raw) ? 'La discussion est trop longue pour le cerveau de Jack. Commence une nouvelle discussion (crayon en haut).'
        : /device|lost|gpu/i.test(raw) ? 'La carte graphique a décroché. Recharge la page pour réveiller Jack.'
        : raw;
      if (/device|lost|gpu/i.test(raw)) { engine = null; engineModel = ''; }
      showError(chat, text);
    }
  } finally {
    setBusy(false);
    if (matchMedia('(pointer: fine)').matches) $('prompt').focus();
  }
}
function send() {
  if (busy) { stopped = true; engine?.interruptGenerate(); return; }
  const text = $('prompt').value.trim();
  if (!text) return;
  stopVoice();
  let chat = currentChat();
  if (!chat) {
    chat = {id: crypto.randomUUID(), title: text.replace(/\s+/g, ' ').slice(0, 80), messages: [], updated: Date.now()};
    state.chats.unshift(chat);
    state.currentId = chat.id;
  }
  chat.messages.push({role: 'user', content: text});
  chat.updated = Date.now();
  state.chats.sort((a, b) => b.updated - a.updated);
  save();
  $('prompt').value = '';
  autoSize();
  render();
  reply(chat);
}
$('composer').onsubmit = event => { event.preventDefault(); send(); };
$('prompt').addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); send(); }
});
function autoSize() {
  const box = $('prompt');
  box.style.height = 'auto';
  box.style.height = Math.min(box.scrollHeight, 220) + 'px';
}
$('prompt').addEventListener('input', autoSize);
document.querySelectorAll('[data-prompt]').forEach(button => button.onclick = () => {
  $('prompt').value = button.dataset.prompt;
  autoSize();
  $('prompt').focus();
  $('prompt').setSelectionRange($('prompt').value.length, $('prompt').value.length);
});
$('newChat').onclick = () => {
  if (busy) return;
  stopVoice();
  state.currentId = null;
  save();
  render();
  $('prompt').focus();
};

// ---------- Mes discussions ----------
function renderHistory() {
  const list = $('historyList');
  list.replaceChildren();
  if (!state.chats.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'Tes discussions apparaîtront ici.';
    list.append(empty);
    return;
  }
  for (const chat of state.chats) {
    const row = document.createElement('div');
    row.className = 'historyItem' + (chat.id === state.currentId ? ' current' : '');
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'open';
    open.textContent = chat.title;
    open.onclick = () => {
      if (busy) return;
      stopVoice();
      state.currentId = chat.id;
      save();
      render();
      $('historyPanel').close();
    };
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'del';
    del.textContent = '✕';
    del.setAttribute('aria-label', 'Supprimer « ' + chat.title + ' »');
    del.onclick = () => {
      if (busy || !confirm('Supprimer cette discussion ?')) return;
      state.chats = state.chats.filter(c => c.id !== chat.id);
      if (state.currentId === chat.id) { state.currentId = null; render(); }
      save();
      renderHistory();
    };
    row.append(open, del);
    list.append(row);
  }
}
$('openHistory').onclick = () => { renderHistory(); $('historyPanel').showModal(); };

// ---------- Réglages ----------
async function showSizeInfo() {
  try {
    const model = await chosenModel($('size').value);
    $('sizeInfo').textContent = model ? 'Téléchargement unique, jusqu’à ' + gigas(model) + '.' : 'IA indisponible dans ce navigateur.';
  } catch { $('sizeInfo').textContent = ''; }
}
$('openSettings').onclick = () => { showSizeInfo(); $('settingsPanel').showModal(); };
$('size').value = state.size;
$('size').onchange = async () => {
  if (busy) { $('size').value = state.size; return; }
  state.size = $('size').value;
  save();
  showSizeInfo();
  if (engine) { await engine.unload(); engine = null; engineModel = ''; }
  prepare();
};
$('forget').onclick = async () => {
  if (busy || !confirm('Supprimer les cerveaux téléchargés de ce navigateur ? Il faudra les retélécharger pour discuter.')) return;
  try {
    const lib = await library();
    if (engine) { await engine.unload(); engine = null; engineModel = ''; }
    const support = await gpuSupport();
    for (const size of Object.keys(SIZES)) {
      for (const f16 of [true, false]) {
        const model = pickModel(lib.prebuiltAppConfig.model_list, size, f16 && !!support?.f16);
        if (model) await lib.deleteModelAllInfoInCache(model.model_id).catch(() => {});
      }
    }
    $('sizeInfo').textContent = 'Cerveaux supprimés.';
    prepare();
  } catch { $('sizeInfo').textContent = 'Suppression impossible.'; }
};
$('autoSpeak').checked = !!state.autoSpeak;
$('autoSpeak').onchange = () => { state.autoSpeak = $('autoSpeak').checked; save(); };
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (event.target === dialog && !inside) dialog.close();
  });
});

// ---------- Voix ----------
let voices = [];
let speaking = false;
let speechRun = 0;
function loadVoices() {
  if (!window.speechSynthesis) return;
  voices = speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('fr'));
  $('voice').replaceChildren(...voices.map(v => new Option(v.name + (v.localService ? '' : ' (en ligne)'), v.voiceURI)));
  if (!voices.length) $('voice').append(new Option('Aucune voix française trouvée', ''));
  if (voices.some(v => v.voiceURI === state.voice)) $('voice').value = state.voice;
}
$('voice').onchange = () => { state.voice = $('voice').value; save(); };
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();
function setSpeaking(value) { speaking = value; document.body.classList.toggle('speaking', value); }
function stopVoice() { speechRun++; window.speechSynthesis?.cancel(); setSpeaking(false); }
function speakable(text) {
  return text
    .replace(/```[\s\S]*?(```|$)/g, ' (voir le code à l’écran) ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_#>|]/g, ' ')
    .replace(/^\s*[-+]\s+/gm, '');
}
function speak(text) {
  stopVoice();
  if (!window.speechSynthesis || !voices.length) return;
  const run = speechRun;
  const parts = speakable(text).match(/[^.!?\n]+[.!?\n]*/g) || [];
  const next = () => {
    if (run !== speechRun) return;
    const part = parts.shift();
    if (!part) { setSpeaking(false); return; }
    if (!part.trim()) { next(); return; }
    const utterance = new SpeechSynthesisUtterance(part);
    utterance.voice = voices.find(v => v.voiceURI === state.voice) || voices[0];
    utterance.lang = 'fr-FR';
    utterance.onstart = () => { if (run === speechRun) setSpeaking(true); };
    utterance.onend = next;
    utterance.onerror = () => { if (run === speechRun) setSpeaking(false); };
    speechSynthesis.speak(utterance);
  };
  next();
}

// ---------- Dictée ----------
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let dictation = null;
if (Recognition) {
  dictation = new Recognition();
  dictation.lang = 'fr-FR';
  dictation.interimResults = false;
  dictation.continuous = false;
  dictation.onstart = () => $('talk').classList.add('listening');
  dictation.onend = () => $('talk').classList.remove('listening');
  dictation.onresult = event => {
    const words = Array.from(event.results).filter(r => r.isFinal).map(r => r[0].transcript).join(' ');
    $('prompt').value = [$('prompt').value.trim(), words].filter(Boolean).join(' ');
    autoSize();
  };
}
$('talk').onclick = () => {
  if (!dictation) { $('prompt').placeholder = 'La dictée marche dans Edge ou Chrome.'; return; }
  if ($('talk').classList.contains('listening')) { dictation.stop(); return; }
  stopVoice();
  try { dictation.start(); } catch {}
};

// ---------- Paysage en fond (suit l'heure de l'appareil) ----------
const LANDSCAPES = {dawn: 'immersion-dawn.jpg', day: 'immersion-day.jpg', dusk: 'immersion-dusk.jpg', night: 'immersion.jpg'};
let landscapeNow = '';
function updateLandscape() {
  const hour = new Date().getHours();
  const moment = hour >= 6 && hour < 9 ? 'dawn' : hour >= 9 && hour < 18 ? 'day' : hour >= 18 && hour < 21 ? 'dusk' : 'night';
  if (moment === landscapeNow) return;
  const image = new Image();
  image.onload = () => {
    $('landscape').style.backgroundImage = `url("${LANDSCAPES[moment]}")`;
    $('landscape').classList.add('ready');
    landscapeNow = moment;
  };
  image.src = LANDSCAPES[moment];
}
updateLandscape();
setInterval(updateLandscape, 60000);

// ---------- Démarrage ----------
render();
prepare();
if (matchMedia('(pointer: fine)').matches) $('prompt').focus();
window.addEventListener('beforeunload', event => { if (busy || loading) { event.preventDefault(); event.returnValue = ''; } });
