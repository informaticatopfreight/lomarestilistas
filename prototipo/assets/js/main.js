/* LOMAR Estilistas — interacciones y animaciones (sin dependencias) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const D = window.LOMAR;

  /* ---------- Hora de Madrid ---------- */
  const madridNow = () => {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const g = t => p.find(x => x.type === t).value;
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[g('weekday')], min: (+g('hour') % 24) * 60 + +g('minute') };
  };
  const toMin = s => { const [h, m] = s.split(':'); return +h * 60 + +m; };

  /* ---------- Cargador ---------- */
  const count = $('.js-count');
  let n = 0;
  const firstImg = $('.hero__slide img');
  const ready = new Promise(r => { if (firstImg.complete) r(); else { firstImg.onload = r; firstImg.onerror = r; } setTimeout(r, 2500); });
  const tick = () => {
    n = Math.min(100, n + Math.max(1, (100 - n) * 0.09));
    count.textContent = Math.round(n);
    if (n < 99.5) requestAnimationFrame(tick);
    else ready.then(() => { document.body.classList.add('is-loaded'); document.body.classList.remove('is-loading'); startSlides(); });
  };
  reduce ? (document.body.classList.add('is-loaded'), document.body.classList.remove('is-loading'), setTimeout(() => startSlides(), 0)) : requestAnimationFrame(tick);

  /* ---------- Hero: diapositivas + palabra rotativa ---------- */
  const slides = $$('.hero__slide');
  const bar = $('.js-slide-bar'), num = $('.js-slide-num');
  const SLIDE_MS = 6000;
  let cur = 0, t0 = 0;
  function startSlides() {
    t0 = performance.now();
    const loop = now => {
      const p = (now - t0) / SLIDE_MS;
      bar.style.transform = `scaleX(${clamp(p, 0, 1)})`;
      if (p >= 1) {
        const prev = slides[cur];
        cur = (cur + 1) % slides.length;
        slides.forEach(s => s.classList.remove('is-leaving'));
        prev.classList.add('is-leaving'); prev.classList.remove('is-active');
        slides[cur].classList.add('is-active');
        num.textContent = String(cur + 1).padStart(2, '0');
        t0 = now;
      }
      requestAnimationFrame(loop);
    };
    if (!reduce) requestAnimationFrame(loop);
  }
  const words = $$('.hero__rotator span');
  let w = 0;
  if (!reduce) setInterval(() => {
    const a = words[w]; w = (w + 1) % words.length; const b = words[w];
    a.classList.remove('is-active'); a.classList.add('is-out');
    b.classList.remove('is-out'); b.classList.add('is-active');
    setTimeout(() => a.classList.remove('is-out'), 900);
  }, 2600);

  /* ---------- Estado abierto / cerrado ---------- */
  const statusEl = $('.js-status-text'), dot = $('.js-status .dot');
  const updateStatus = () => {
    const { day, min } = madridNow(); const h = D.hours[day];
    if (h && min >= toMin(h[0]) && min < toMin(h[1])) { statusEl.textContent = `Abierto ahora · hasta las ${h[1]}`; dot.classList.remove('is-closed'); }
    else {
      let add = 0, d = day, nx = null;
      if (h && min < toMin(h[0])) nx = h;
      while (!nx && add < 7) { add++; d = (day + add) % 7; nx = D.hours[d]; }
      const names = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      statusEl.textContent = `Cerrado · abrimos ${add === 0 ? 'hoy' : add === 1 ? 'mañana' : 'el ' + names[d]} a las ${nx[0]}`;
      dot.classList.add('is-closed');
    }
    $$('.js-hours tr').forEach(tr => tr.classList.toggle('is-today', +tr.dataset.d === day));
  };
  updateStatus(); setInterval(updateStatus, 60000);
  $('.js-year').textContent = new Date().getFullYear();

  /* ---------- Navegación ---------- */
  const nav = $('.nav');
  let lastY = 0;
  $('.js-menu').addEventListener('click', e => {
    const open = document.body.classList.toggle('menu-open');
    e.currentTarget.setAttribute('aria-expanded', open);
    $('.menu').setAttribute('aria-hidden', !open);
  });
  $$('.menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  const sections = $$('main section[id]');
  const links = $$('.nav__links a');

  /* ---------- Texto que se ilumina palabra a palabra ---------- */
  $$('.js-words').forEach(el => {
    const walk = node => [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(t => {
          if (!t.trim()) return frag.append(t);
          const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s);
        });
        ch.replaceWith(frag);
      } else if (ch.nodeType === 1) walk(ch);
    });
    walk(el);
  });
  const wordEls = $$('.js-words .w');

  /* ---------- Titulares partidos por palabras ---------- */
  $$('.split').forEach(el => {
    const walk = node => [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(t => {
          if (!t.trim()) return frag.append(t);
          const o = document.createElement('span'); o.className = 'sw';
          const i = document.createElement('span'); i.textContent = t; o.append(i); frag.append(o);
        });
        ch.replaceWith(frag);
      } else if (ch.nodeType === 1) {
        const o = document.createElement('span'); o.className = 'sw';
        ch.replaceWith(o); const i = document.createElement('span'); i.append(ch); o.append(i);
      }
    });
    walk(el);
    $$('.sw>span', el).forEach((s, i) => s.style.transitionDelay = `${i * 0.06}s`);
  });

  /* ---------- Revelado al entrar en pantalla ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.18 });
  $$('.split, .reveal-img, [data-reveal]').forEach(el => io.observe(el));

  /* ---------- Servicios (desde datos reales) ---------- */
  const svcList = $('.js-svc');
  D.groups.forEach((g, i) => {
    const items = D.services.filter(s => s.g === g.id);
    const li = document.createElement('li');
    li.className = 'svc__item';
    li.innerHTML = `
      <button class="svc__row" data-img="${g.img}" aria-expanded="false">
        <span class="svc__num">${String(i + 1).padStart(2, '0')}</span>
        <span class="svc__name">${g.name}</span>
        <span class="svc__count">${items.length} servicios</span>
        <span class="svc__plus" aria-hidden="true"></span>
      </button>
      <div class="svc__panel"><div>
        <p class="svc__hint">Pulsa un servicio para reservarlo · Precio a consultar según largo</p>
        <ul class="svc__list">
        ${items.map(s => `<li><button class="js-book" data-service="${s.id}" data-cursor="Reservar"><span class="svc__label">${s.name}</span><span class="svc__time"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${fmtDur(s.min)}</span></button></li>`).join('')}
      </ul></div></div>`;
    svcList.append(li);
  });
  function fmtDur(m) { const h = Math.floor(m / 60), r = m % 60; return h ? `${h} h${r ? ' ' + r + ' min' : ''}` : `${r} min`; }
  window.fmtDur = fmtDur;
  $$('.svc__row').forEach(b => b.addEventListener('click', () => {
    const it = b.parentElement, open = !it.classList.contains('is-open');
    $$('.svc__item.is-open').forEach(o => { o.classList.remove('is-open'); o.firstElementChild.setAttribute('aria-expanded', false); });
    if (open) { it.classList.add('is-open'); b.setAttribute('aria-expanded', true); }
  }));

  // Imagen flotante que sigue al cursor sobre las filas de servicios
  const float = $('.svc-float'), floatImg = $('img', float);
  const fp = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine) {
    $$('.svc__row').forEach(r => {
      r.addEventListener('mouseenter', () => { floatImg.src = r.dataset.img; float.classList.add('is-on'); });
      r.addEventListener('mouseleave', () => float.classList.remove('is-on'));
    });
  }

  /* ---------- Cursor + magnetismo + tilt ---------- */
  const cursor = $('.cursor'), cLabel = $('.cursor__label');
  const m = { x: innerWidth / 2, y: innerHeight / 2 }, c = { x: m.x, y: m.y };
  addEventListener('mousemove', e => { m.x = e.clientX; m.y = e.clientY; fp.tx = e.clientX + 30; fp.ty = e.clientY - 180; }, { passive: true });
  if (fine) {
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('a,button,[data-cursor]');
      cursor.classList.toggle('is-hover', !!t && !t.dataset.cursor);
      cursor.classList.toggle('is-label', !!(t && t.dataset.cursor));
      cLabel.textContent = t && t.dataset.cursor ? t.dataset.cursor : '';
    });
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  /* ---------- Bucle de scroll ---------- */
  const marquee = $('.js-marquee'), marquee2 = $('.js-marquee2');
  const color = $('.color'), track = $('.js-htrack');
  const gcols = $$('.gcol');
  const intro = $('.intro__text');
  const plx = $$('[data-parallax]');
  let mx = 0, mx2 = 0, vel = 0, sy = scrollY;

  const cIntro = $('.color__intro');
  const colorMax = () => Math.max(0, cIntro.offsetWidth + track.scrollWidth + parseFloat(getComputedStyle(cIntro.parentElement).gap) + parseFloat(getComputedStyle(cIntro.parentElement).paddingLeft) - innerWidth);
  const sizeColor = () => {
    if (innerWidth <= 820) { color.style.removeProperty('--h'); return; }
    color.style.setProperty('--h', `${innerHeight + colorMax()}px`);
  };
  addEventListener('resize', sizeColor); addEventListener('load', sizeColor); sizeColor();

  const frame = () => {
    const y = scrollY, dy = y - sy; sy = y;
    vel = lerp(vel, dy, 0.1);

    // Nav
    nav.classList.toggle('is-scrolled', y > 40);
    if (!document.body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY + 4 && y > 400);
    if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;

    if (!reduce) {
      // Marquee con aceleración según la velocidad de scroll
      const w = marquee.scrollWidth / 2;
      mx = (mx - 0.6 - Math.abs(vel) * 0.4) % w;
      marquee.style.transform = `translate3d(${mx}px,0,0) skewX(${clamp(-vel * 0.3, -10, 10)}deg)`;
      const w2 = marquee2.scrollWidth / 2;
      mx2 = (mx2 - 1.1 - Math.abs(vel) * 0.3) % w2;
      marquee2.style.transform = `translate3d(${mx2}px,0,0)`;

      // Parallax de imágenes
      plx.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2);
        el.firstElementChild.style.transform = `translate3d(0,${p * +el.dataset.parallax - 40}px,0)`;
      });

      // Galería en columnas a distinta velocidad
      const g = gcols[0] && gcols[0].parentElement.getBoundingClientRect();
      if (g && g.top < innerHeight && g.bottom > 0) {
        const p = (innerHeight - g.top) / (innerHeight + g.height);
        gcols.forEach(cl => cl.style.transform = `translate3d(0,${(p - 0.5) * +cl.dataset.speed * -1400}px,0)`);
      }

      // Scroll horizontal de la sección de color
      if (innerWidth > 820) {
        const r = color.getBoundingClientRect();
        const total = color.offsetHeight - innerHeight;
        const p = clamp(-r.top / total, 0, 1);
        const x = `translate3d(${-p * colorMax()}px,0,0)`;
        track.style.transform = x; cIntro.style.transform = x;
      }

      // Imagen flotante de servicios
      fp.x = lerp(fp.x, fp.tx, 0.14); fp.y = lerp(fp.y, fp.ty, 0.14);
      float.style.left = fp.x + 'px'; float.style.top = fp.y + 'px';
      float.style.rotate = `${clamp((fp.tx - fp.x) * 0.05, -8, 8)}deg`;
    }

    // Palabras del manifiesto
    const ir = intro.getBoundingClientRect();
    const ip = clamp((innerHeight * 0.85 - ir.top) / (ir.height + innerHeight * 0.35), 0, 1);
    const on = Math.floor(ip * wordEls.length);
    wordEls.forEach((el, i) => el.classList.toggle('is-on', reduce || i < on));

    // Enlace activo del menú
    let curId = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) curId = s.id; });
    links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + curId));

    // Cursor
    c.x = lerp(c.x, m.x, 0.22); c.y = lerp(c.y, m.y, 0.22);
    cursor.style.transform = `translate3d(${c.x}px,${c.y}px,0)`;

    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
