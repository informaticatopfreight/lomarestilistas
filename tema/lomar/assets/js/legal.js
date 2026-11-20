/* Páginas interiores: cabecera común (menú móvil y estado al hacer scroll). */
(() => {
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.js-menu');
  const menu = document.querySelector('.menu');
  btn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();
