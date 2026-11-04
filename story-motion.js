(() => {
  'use strict';
  if (!document.body.classList.contains('home')) return;
  const heading = document.querySelector('[data-story-motion]');
  if (!heading || !('IntersectionObserver' in window) || typeof heading.animate !== 'function') return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let words = null;
  let active = [];
  let armed = true;
  let observer;
  function splitWords() {
    if (words) return;
    const accessible = document.createElement('span');
    accessible.className = 'motion-sr-only';
    accessible.textContent = heading.innerText.replace(/\s+/g, ' ').trim();
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    while (heading.firstChild) visual.append(heading.firstChild);
    const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(token => {
        if (!token) return;
        if (/^\s+$/.test(token)) fragment.append(document.createTextNode(token));
        else {
          const word = document.createElement('span');
          word.className = 'motion-word';
          word.textContent = token;
          fragment.append(word);
        }
      });
      node.replaceWith(fragment);
    });
    heading.append(accessible, visual);
    words = Array.from(visual.querySelectorAll('.motion-word'));
  }
  function stop() {
    active.forEach(animation => animation.cancel());
    active = [];
  }
  function play() {
    if (reduced.matches || document.hidden || document.querySelector('dialog[open]')) return;
    splitWords();
    stop();
    armed = false;
    const stagger = words.length > 1 ? 880 / (words.length - 1) : 0;
    active = words.map((word, index) => word.animate([
      { opacity:0, transform:'translateY(18px)' },
      { opacity:1, transform:'translateY(0)' }
    ], { duration:1100, delay:120 + index * stagger, easing:'cubic-bezier(.22,1,.36,1)', fill:'backwards' }));
    Promise.allSettled(active.map(animation => animation.finished)).then(() => {
      active = active.filter(animation => animation.playState !== 'finished' && animation.playState !== 'idle');
    });
  }
  function observe() {
    observer?.disconnect();
    stop();
    armed = true;
    if (reduced.matches || document.hidden) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) { stop(); armed = true; return; }
        if (entry.intersectionRatio >= .25 && armed) play();
      });
    }, { threshold:[0,.25] });
    observer.observe(heading);
  }
  reduced.addEventListener('change', observe);
  document.addEventListener('visibilitychange', observe);
  document.querySelector('dialog[open]')?.addEventListener('close', observe, { once:true });
  observe();
})();
