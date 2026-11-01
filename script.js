// My Spot® — comportamiento compartido
// Año del footer
document.getElementById('year').textContent = new Date().getFullYear();

// Borde del navbar al hacer scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú móvil
const btn = document.getElementById('menuBtn');
const menu = document.getElementById('navMenu');
const setMenu = open => {
  menu.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
  btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
};
btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Resaltar la sección visible en el menú
const navLinks = [...document.querySelectorAll('.nav-links a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach(a => { const h = a.getAttribute('href'); const sec = h.startsWith('#') && document.querySelector(h); if (sec) spy.observe(sec); });

// Animación de aparición
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Al abrir una página sin #sección, empezar siempre arriba del todo
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('pageshow', () => { if (!location.hash) window.scrollTo(0, 0); });

// Botón "Volver a catálogos": solo aparece si llegaste desde el Linktree de My Spot
// (el Linktree abre esta página con ?desde=linktree). Si la buscas o te la mandan, no aparece.
(() => {
  const LINKTREE = 'https://linktree-my-spot.vercel.app/';
  const PAGINAS = ['', 'prescolar.html', 'gym.html', 'after-school.html'];
  const CLAVE = 'myspot-volver';
  let volver = null;
  try {
    const q = new URLSearchParams(location.search);
    if (q.get('desde') === 'linktree') {
      const p = q.get('volver') || '';
      volver = LINKTREE + (PAGINAS.includes(p) ? p : '');
      sessionStorage.setItem(CLAVE, volver);
      // Quita el parámetro de la dirección para que, si la comparten, no lleve el botón
      q.delete('desde'); q.delete('volver');
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
    } else {
      volver = sessionStorage.getItem(CLAVE);
    }
  } catch (e) { /* sin almacenamiento: solo funciona en la primera página */ }
  if (!volver) return;

  const css = document.createElement('style');
  css.textContent = `
    .volver-linktree { position: fixed; left: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); z-index: 60;
      display: inline-flex; align-items: center; gap: 8px; padding: 11px 16px 11px 13px; border-radius: 999px;
      background: var(--ink, #4a594a); color: #fff; font: 600 14px/1 "Inter", system-ui, sans-serif;
      box-shadow: 0 8px 24px rgba(74, 89, 74, .25); transition: transform .2s; }
    .volver-linktree:hover { transform: translateY(-2px); }
    .volver-linktree svg { width: 16px; height: 16px; }`;
  document.head.appendChild(css);

  const a = document.createElement('a');
  a.className = 'volver-linktree';
  a.href = volver;
  a.innerHTML = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Volver a catálogos';
  document.body.appendChild(a);
})();
