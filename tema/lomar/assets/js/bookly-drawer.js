/* Abre y cierra el panel lateral con el formulario de Bookly. */
(() => {
  const el = document.querySelector('.book');
  if (!el) return;
  const open = () => { el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false'); document.body.classList.add('is-locked'); };
  const close = () => { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); document.body.classList.remove('is-locked'); };
  document.addEventListener('click', e => {
    if (e.target.closest('.js-book')) { e.preventDefault(); open(); }
    if (e.target.closest('.js-book-close')) close();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && el.classList.contains('is-open')) close(); });
})();
