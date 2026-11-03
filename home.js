(() => {
  if (!document.body.classList.contains('home')) return;
  const nav = document.querySelector('header nav .links');
  const hero = document.querySelector('.page-head');
  if (!nav || !hero) return;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const highlight = document.createElement('span');
  highlight.className = 'menu-highlight';
  highlight.setAttribute('aria-hidden', 'true');
  nav.prepend(highlight);
  const word = document.createElement('span');
  word.className = 'hover-word';
  word.setAttribute('aria-hidden', 'true');
  hero.prepend(word);
  const words = { 'index.html':'BIENVENUE', 'produits.html':'BIÈRES', 'service.html':'TALLER', 'commandes.html':'BRASSINS', 'FAQ.html':'BRASSERIE', 'Avis.html':'VOS MOTS', 'compte.html':'EN DIRECT' };
  let active = null;
  let timer = 0;
  let frame = 0;
  function hide() {
    active = null;
    clearTimeout(timer);
    highlight.classList.remove('visible');
    word.classList.remove('visible');
  }
  function show(link) {
    active = link;
    clearTimeout(timer);
    if (reduced.matches || nav.hidden) return;
    const box = link.getBoundingClientRect();
    const parent = nav.getBoundingClientRect();
    highlight.style.width = `${box.width + 16}px`;
    highlight.style.height = `${box.height}px`;
    highlight.style.transform = `translate(${box.left - parent.left - 8}px,${box.top - parent.top}px)`;
    highlight.classList.add('visible');
    const next = words[link.getAttribute('href')] || 'TALLER';
    if (word.textContent === next) { word.classList.add('visible'); return; }
    word.classList.remove('visible');
    timer = setTimeout(() => {
      if (active !== link || reduced.matches || nav.hidden) return;
      word.textContent = next;
      word.classList.add('visible');
    }, 180);
  }
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('pointerenter', () => { if (fine.matches) show(link); });
    link.addEventListener('focus', () => show(link));
  });
  nav.addEventListener('pointerleave', () => {
    const focused = nav.querySelector('a:focus-visible');
    if (focused) show(focused); else hide();
  });
  nav.addEventListener('focusout', () => requestAnimationFrame(() => {
    const focused = nav.querySelector('a:focus-visible');
    const hovered = fine.matches ? nav.querySelector('a:hover') : null;
    if (focused || hovered) show(focused || hovered); else hide();
  }));
  hero.addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = hero.getBoundingClientRect();
      hero.style.setProperty('--pointer-x', `${((event.clientX - box.left) / box.width - .5) * 12}px`);
      hero.style.setProperty('--pointer-y', `${((event.clientY - box.top) / box.height - .5) * 8}px`);
    });
  });
  hero.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    hero.style.setProperty('--pointer-x', '0px');
    hero.style.setProperty('--pointer-y', '0px');
  });
  function reset() {
    hide();
    cancelAnimationFrame(frame);
    hero.style.setProperty('--pointer-x', '0px');
    hero.style.setProperty('--pointer-y', '0px');
  }
  reduced.addEventListener('change', reset);
  fine.addEventListener('change', reset);
  window.addEventListener('resize', () => { if (active && !nav.hidden) show(active); else hide(); });
  new MutationObserver(() => { if (nav.hidden) hide(); }).observe(nav, { attributes:true, attributeFilter:['hidden'] });
})();
