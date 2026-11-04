(() => {
  'use strict';
  if (!document.body.classList.contains('home')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1000px) and (hover: hover) and (pointer: fine)');
  const animations = new Set();
  let observer;
  let frame = 0;
  let titlePlayed = false;
  let titlePending = false;
  const title = document.querySelector('[data-motion-title]');
  const photo = document.querySelector('[data-motion-photo]');
  const frameBox = photo?.closest('.motion-photo-frame');
  const seen = new WeakSet();
  const canAnimate = typeof Element.prototype.animate === 'function';
  function animate(element, keyframes, options) {
    if (!canAnimate || reduced.matches) return;
    const animation = element.animate(keyframes, options);
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
  }
  function titleEntrance() {
    titlePending = false;
    if (!title || titlePlayed || reduced.matches || !canAnimate) return;
    titlePlayed = true;
    const label = document.createElement('span');
    label.className = 'motion-sr-only';
    label.textContent = title.innerText.replace(/\s+/g, ' ').trim();
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    while (title.firstChild) visual.append(title.firstChild);
    const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(token => {
        if (!token) return;
        if (/^\s+$/.test(token)) fragment.append(document.createTextNode(token));
        else { const word = document.createElement('span'); word.className = 'motion-word'; word.textContent = token; fragment.append(word); }
      });
      node.replaceWith(fragment);
    });
    title.append(label, visual);
    visual.querySelectorAll('.motion-word').forEach((word, index) => animate(word, [
      { opacity:0, transform:'translateY(18px)' },
      { opacity:1, transform:'translateY(0)' }
    ], { duration:650, delay:index * 65, easing:'cubic-bezier(.22,1,.36,1)', fill:'backwards' }));
  }
  function startTitle() {
    if (titlePlayed || titlePending || reduced.matches) return;
    const gate = document.querySelector('dialog[open]');
    if (gate) { titlePending = true; gate.addEventListener('close', titleEntrance, { once:true }); }
    else titleEntrance();
  }
  function setupReveals() {
    observer?.disconnect();
    if (reduced.matches || !canAnimate || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);
      observer.unobserve(entry.target);
      animate(entry.target, [
        { opacity:.25, transform:'translateY(20px)' },
        { opacity:1, transform:'translateY(0)' }
      ], { duration:650, easing:'cubic-bezier(.22,1,.36,1)' });
    }), { threshold:.12 });
    document.querySelectorAll('[data-motion-reveal]').forEach(element => { if (!seen.has(element)) observer.observe(element); });
  }
  function drawPhoto() {
    frame = 0;
    if (!photo || !frameBox || reduced.matches || !desktop.matches || document.hidden) return;
    const rect = frameBox.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
    photo.style.setProperty('--photo-shift', `${(progress - .5) * 24}px`);
    photo.style.setProperty('--photo-scale', '1.09');
  }
  function schedulePhoto() { if (!frame && !reduced.matches && desktop.matches) frame = requestAnimationFrame(drawPhoto); }
  function reset() {
    animations.forEach(animation => animation.cancel());
    animations.clear();
    cancelAnimationFrame(frame); frame = 0;
    photo?.style.removeProperty('--photo-shift');
    photo?.style.removeProperty('--photo-scale');
    setupReveals(); startTitle(); schedulePhoto();
  }
  window.addEventListener('scroll', schedulePhoto, { passive:true });
  window.addEventListener('resize', schedulePhoto, { passive:true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedulePhoto(); });
  reduced.addEventListener('change', reset);
  desktop.addEventListener('change', reset);
  startTitle(); setupReveals(); schedulePhoto();
  const video = document.querySelector('[data-brewery-video]');
  async function enableFilm() {
    if (!video) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(video.dataset.breweryVideo, { method:'HEAD', signal:controller.signal });
      if (!response.ok || !/^video\//i.test(response.headers.get('content-type') || '')) return;
      video.src = video.dataset.breweryVideo;
      video.closest('.brewery-film').hidden = false;
      video.addEventListener('error', () => { video.closest('.brewery-film').hidden = true; }, { once:true });
    } catch { /* Keep optional film hidden when no rendered asset is available. */ }
    finally { clearTimeout(timeout); }
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(enableFilm, { timeout:3000 });
  else setTimeout(enableFilm, 1500);
})();
