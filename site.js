const pages = [
  ['index.html','Accueil'], ['produits.html','Les bières'],
  ['service.html','À la brasserie'], ['commandes.html','Commander'],
  ['FAQ.html','FAQ'], ['Avis.html','Avis'], ['compte.html','Compte']
];
const header = document.querySelector('header');
if (header) {
  header.innerHTML = `<div class="ribbon">BRASSERIE ARTISANALE · TALLER · LANDES</div><nav class="wrap" aria-label="Navigation principale"><a class="brand" href="index.html">Auzem’Beers &amp; Sons<small>BRASSERIE ARTISANALE</small></a><button class="menu" aria-expanded="false" aria-controls="navigation">Menu</button><div class="links" id="navigation">${pages.map(([url,label]) => `<a href="${url}" ${location.pathname.endsWith(url) || (url === 'index.html' && location.pathname.endsWith('/')) ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</div></nav>`;
  const toggle = header.querySelector('button');
  const links = header.querySelector('.links');
  const mobile = matchMedia('(max-width:850px)');
  function setMenu(open) {
    links.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fermer' : 'Menu';
  }
  function syncMenu() { setMenu(!mobile.matches); }
  syncMenu();
  mobile.addEventListener('change', syncMenu);
  toggle.addEventListener('click', () => setMenu(links.hidden));
  links.addEventListener('click', event => { if (mobile.matches && event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobile.matches && !links.hidden) { setMenu(false); toggle.focus(); }
  });
}
const footer = document.querySelector('footer');
if (footer) {
  footer.innerHTML = `<div class="wrap"><div class="footer-top"><div><a class="brand" href="index.html">Auzem’Beers &amp; Sons</a><p>551 Route de Cap de Lelane<br>40260 Taller, Landes</p></div><div class="links">${pages.map(([url,label]) => `<a href="${url}">${label}</a>`).join('')}<a href="https://www.instagram.com/ericauzemery/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div></div><p class="legal">© 2026 Auzem’Beers &amp; Sons · L’abus d’alcool est dangereux pour la santé. À consommer avec modération.</p></div>`;
}
let verified = false;
try { verified = sessionStorage.getItem('age_verified') === 'true'; } catch {}
if (!verified) {
  const gate = document.createElement('dialog');
  gate.setAttribute('aria-labelledby', 'age-title');
  gate.innerHTML = '<p class="eyebrow">Auzem’Beers &amp; Sons</p><h2 id="age-title">Bienvenue.<br>Êtes-vous majeur ?</h2><p>Ce site s’adresse aux personnes ayant l’âge légal pour consommer de l’alcool dans leur pays.</p><button class="button" autofocus>Oui, j’ai l’âge légal</button><a href="https://www.google.com/">Non, quitter le site</a>';
  document.body.append(gate);
  gate.addEventListener('cancel', event => event.preventDefault());
  gate.querySelector('button').addEventListener('click', () => {
    try { sessionStorage.setItem('age_verified', 'true'); } catch {}
    gate.close();
    document.querySelector('.brand')?.focus();
  });
  gate.showModal();
}
function enquiryURL(value) { return `commandes.html?demande=${encodeURIComponent(value)}`; }
document.querySelectorAll('.product').forEach(product => {
  const name = product.querySelector('h2')?.textContent.trim();
  const link = product.querySelector('a[href="commandes.html"]');
  if (name && link) link.href = enquiryURL(name);
});
document.querySelectorAll('#tireuses a[href="commandes.html"]').forEach(link => { link.href = enquiryURL('Une location de tireuse'); });
const request = document.querySelector('#request');
const prepare = document.querySelector('#prepare');
if (request && prepare) {
  const selected = new URLSearchParams(location.search).get('demande');
  if (selected && Array.from(request.options).some(option => option.value === selected)) request.value = selected;
  prepare.hidden = false;
  prepare.addEventListener('click', () => {
    const output = document.querySelector('#message');
    output.value = `Bonjour Éric, je souhaiterais des informations sur : ${request.value}.\nQuantité / date souhaitée : …\nMerci !`;
    document.querySelector('#draft').hidden = false;
    output.focus();
  });
  request.addEventListener('change', () => {
    document.querySelector('#draft').hidden = true;
    document.querySelector('#message').value = '';
  });
}
