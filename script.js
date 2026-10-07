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
