'use strict';
// Export uses its own media elements so preview seeking cannot alter the recording.
let exportJob = null;
const exportDialog = $('export-dialog');
$('export-video').onclick = () => {
  if (!clips.length) return status('Ajoute des médias à la timeline avant d’exporter.');
  if (clips.some(c => !asset(c.asset)?.el)) return status('Réimporte les fichiers manquants avant d’exporter.');
  pause();
  $('export-info').textContent = `Durée du montage : ${stamp(end())}. L’export prend la durée du montage. Garde cette fenêtre visible.`;
  $('export-progress').value = 0;
  $('export-state').textContent = 'Choisis le format. Images, titres, sous-titres, fondus et mixage sont inclus.';
  exportDialog.showModal();
};
$('export-close').onclick = () => exportDialog.close();
$('export-cancel').onclick = () => exportJob?.abort();
exportDialog.addEventListener('cancel', e => { if (exportJob) { e.preventDefault(); exportJob.abort(); } });

function exportGain(c, levels) {
  return (typeof laneGain==='function'?laneGain(c):1) * c.volume * levels.master * (c.kind === 'video'
    ? (levels.muteVideo ? 0 : levels.video) : (levels.muteAudio ? 0 : levels.audio));
}
function mediaReady(el, event, action, signal, ready) {
  return new Promise((resolve, reject) => {
    let timer;
    const cleanup = () => { clearTimeout(timer); el.removeEventListener(event, ok); el.removeEventListener('error', fail); signal.removeEventListener('abort', cancelled); };
    const ok = () => { cleanup(); resolve(); };
    const fail = () => { cleanup(); reject(Error('Un média ne peut pas être préparé pour l’export.')); };
    const cancelled = () => { cleanup(); reject(Error('Export annulé.')); };
    el.addEventListener(event, ok, {once:true}); el.addEventListener('error', fail, {once:true}); signal.addEventListener('abort', cancelled, {once:true});
    timer = setTimeout(fail, 20000);
    if (signal.aborted) return cancelled();
    try { action(); if (ready?.()) ok(); } catch (error) { cleanup(); reject(error); }
  });
}
$('export-start').onclick = async () => {
  if (exportJob) return;
  const mp4=$('export-format').value==='mp4';
  const formats = mp4?['video/mp4','video/mp4;codecs=avc1.640028,mp4a.40.2']:['video/webm;codecs=vp8,opus', 'video/webm'];
  const mimeType = typeof MediaRecorder !== 'undefined' && formats.find(type => MediaRecorder.isTypeSupported(type));
  if (!mimeType || !canvas.captureStream || !window.AudioContext) { $('export-state').textContent = 'Ce format n’est pas disponible dans ce navigateur. Essaie WebM ou un navigateur récent.'; return; }
  const controller = new AbortController(); exportJob = controller;
  $('export-progress').value = 0;
  const signal = controller.signal, entries = [], chunks = [];
  const duration = end(), levels = {...mix};
  const snapshot = clips.filter(c=>typeof laneEnabled!=='function'||laneEnabled(c)).map(c => ({...c}));
  const output = document.createElement('canvas');
  [output.width,output.height] = dimensions(projectRatio,Number($('export-size').value));
  const painter = output.getContext('2d');
  let engine, stream, recorder, frameId, silence, failure, bytes = 0;
  const onHidden = () => { if (document.hidden) { failure = Error('Export interrompu : la fenêtre doit rester visible. Relance l’export.'); controller.abort(); } };
  const onLeave = e => { e.preventDefault(); e.returnValue = ''; };
  const controls = ['export-start','export-size','export-format','export-close'];
  controls.forEach(id => $(id).disabled = true); $('export-cancel').hidden = false;
  document.addEventListener('visibilitychange', onHidden); window.addEventListener('beforeunload', onLeave);
  try {
    if(document.hidden) throw Error('Garde la fenêtre visible pour lancer l’export.');
    pause(); engine = new AudioContext(); await engine.resume();
    const destination = engine.createMediaStreamDestination();
    // Keep an audio clock even for a slideshow or gaps with no active sound.
    silence = engine.createOscillator();
    const silentGain = engine.createGain(); silentGain.gain.value = 0;
    silence.connect(silentGain); silentGain.connect(destination); silence.start();
    $('export-state').textContent = 'Préparation des médias…';
    const audioCache=new Map();let decodedBytes=0;
    async function cachedAudio(original){
      if(audioCache.has(original.id))return audioCache.get(original.id);
      if(original.size>200*1024*1024)throw Error('Média trop volumineux pour cet export local. Utilise un extrait plus court.');
      const buffer=await decodeAssetAudio(original,engine);decodedBytes+=buffer.length*buffer.numberOfChannels*4;
      if(decodedBytes>512*1024*1024)throw Error('Le son décodé dépasse la mémoire prévue. Exporte un montage plus court.');
      audioCache.set(original.id,buffer);return buffer;
    }
    for (const c of snapshot) {
      if (signal.aborted) throw Error('Export annulé.');
      const original = asset(c.asset);
      const entry = {clip:c, el:original.el, started:false}; entries.push(entry);
      if (c.kind === 'image') continue;
      if(c.kind==='audio'){
        const buffer=await cachedAudio(original),source=engine.createBufferSource(),gain=engine.createGain();
        if(c.trim+c.duration>buffer.duration+.05)throw Error('Durée audio insuffisante : '+original.name);
        source.buffer=buffer;source.connect(gain);gain.gain.value=exportGain(c,levels);entry.filters=connectEqualizer(engine,gain,destination,levels);entry.source=source;entry.gain=gain;entry.buffered=true;continue;
      }
      const el = document.createElement(c.kind); entry.el = el;
      el.preload = 'auto'; el.playsInline = true;
      await mediaReady(el, 'loadeddata', () => { el.src = original.url; el.load(); }, signal, () => el.readyState >= 2);
      if (c.trim > 0) await mediaReady(el, 'seeked', () => { el.currentTime = c.trim; }, signal, () => !el.seeking && Math.abs(el.currentTime - c.trim) < .001);
      el.muted=true;
      entry.hasVideo=true;
      if(exportGain(c,levels)>0){
        let buffer;try{buffer=await cachedAudio(original);}catch(error){throw Error('Son vidéo non décodable dans '+original.name+' : '+error.message+' Coupe son volume uniquement si tu veux exclure ce son.');}
        const source=engine.createBufferSource(),gain=engine.createGain();source.buffer=buffer;source.connect(gain);gain.gain.value=exportGain(c,levels);entry.filters=connectEqualizer(engine,gain,destination,levels);entry.source=source;entry.gain=gain;entry.buffered=true;
      }

    }
    function paint(t) {paintComposition(painter,t,output.width,output.height,entries);}
    paint(0); stream = output.captureStream(30);
    destination.stream.getAudioTracks().forEach(track => stream.addTrack(track));
    recorder = new MediaRecorder(stream, {mimeType, videoBitsPerSecond:output.width === 1920 ? 8000000 : 4000000, audioBitsPerSecond:192000});
    await new Promise((resolve,reject) => {
      const abort = () => { failure ||= Error('Export annulé.'); stop(); };
      function stop() { cancelAnimationFrame(frameId); entries.forEach(e => { if(e.buffered){try{e.source.stop();}catch{}}if(e.hasVideo)e.el.pause(); }); if(recorder.state !== 'inactive') recorder.stop(); else reject(failure || Error('Enregistrement interrompu.')); }
      signal.addEventListener('abort', abort, {once:true});
      recorder.ondataavailable = e => { if(e.data.size) { bytes += e.data.size; chunks.push(e.data); if(bytes > 512*1024*1024) { failure = Error('Export trop volumineux (limite 512 Mo). Réduis la durée ou choisis 720p.'); stop(); } } };
      recorder.onerror = () => { failure = Error('Le navigateur a interrompu l’enregistrement.'); stop(); };
      recorder.onstop = () => { signal.removeEventListener('abort', abort); failure ? reject(failure) : resolve(); };
      recorder.start(1000);
      const beginning = performance.now(); let previous = beginning;const audioStart=engine.currentTime+.1;
      for(const entry of entries)if(entry.buffered)entry.source.start(audioStart+entry.clip.start,entry.clip.trim,entry.clip.duration);
      function tick(now) {
        if (signal.aborted) return;
        try {
          if (now-previous > 1500) throw Error('Export interrompu : ordinateur trop occupé. Réessaie en 720p.');
          previous = now;
          const t = Math.max(0,engine.currentTime-audioStart);
          if((now-beginning)/1000>duration+10)throw Error('Le moteur audio est suspendu. Relance l’export en gardant la fenêtre active.');
          if (t >= duration) { stop(); return; }
          for (const entry of entries) {
            const {clip:c,el} = entry;
            if(c.kind === 'image') continue;
            if(entry.gain)entry.gain.gain.value=exportGain(c,levels)*envelope(c,t);
            if(c.kind==='audio')continue;
            if(t >= c.start && t < c.start+c.duration) {
              if(!entry.started) { entry.started=true; el.play().catch(() => { failure=Error('Lecture d’un média refusée pendant l’export.'); controller.abort(); }); }
              if(el.readyState < 2) throw Error('Lecture trop lente : export interrompu pour éviter un fichier incomplet.');
              if(Math.abs(el.currentTime - (c.trim+t-c.start)) > .5 && !el.ended) throw Error('Lecture désynchronisée ('+el.currentTime.toFixed(2)+' / '+(c.trim+t-c.start).toFixed(2)+' s). Relance en 720p.');
            } else if(entry.started) el.pause();
          }
          paint(t); $('export-progress').value = t/duration;
          $('export-state').textContent = `Export en cours : ${Math.floor(t/duration*100)} % · ${stamp(t)} / ${stamp(duration)}`;
          frameId = requestAnimationFrame(tick);
        } catch(error) { failure=error; stop(); }
      }
      if(signal.aborted) abort(); else tick(beginning);
    });
    if(!bytes) throw Error('Aucune vidéo produite.');
    download(new Blob(chunks, {type:recorder.mimeType}), projectFilename()+(mp4?'.mp4':'.webm'));
    $('export-progress').value = 1; $('export-state').textContent = 'Vidéo '+(mp4?'MP4':'WebM')+' créée. Vérifie le fichier téléchargé avant de le partager.';
    status('Export vidéo terminé : '+projectFilename()+(mp4?'.mp4':'.webm'));
  } catch(error) { $('export-state').textContent = failure?.message || error.message; status($('export-state').textContent); }
  finally {
    cancelAnimationFrame(frameId);
    if(recorder && recorder.state !== 'inactive') recorder.stop();
    stream?.getTracks().forEach(track => track.stop());
    for(const entry of entries) if(entry.clip.kind !== 'image') { if(entry.buffered){try{entry.source.stop();}catch{}}if(entry.hasVideo){entry.el.pause();entry.el.removeAttribute('src');entry.el.load();}entry.source?.disconnect();entry.gain?.disconnect(); }
    silence?.stop();
    if(engine) await engine.close().catch(()=>{});
    document.removeEventListener('visibilitychange', onHidden); window.removeEventListener('beforeunload', onLeave);
    controls.forEach(id => $(id).disabled = false); $('export-cancel').hidden = true; exportJob = null;
  }
};

