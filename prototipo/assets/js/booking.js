/* LOMAR — flujo de reserva (prototipo).
   La disponibilidad aquí es SIMULADA. En producción la calcula el gestor de reservas en el servidor. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const D = window.LOMAR;
  const fmtDur = window.fmtDur || (m => { const h = Math.floor(m / 60), r = m % 60; return h ? `${h} h${r ? ' ' + r + ' min' : ''}` : `${r} min`; });
  const HOLD_SECONDS = 5 * 60;
  const MAX_DAYS = 60;
  const STEP_MIN = 30;

  const el = $('.book'), body = $('.js-book-body'), title = $('.js-book-title');
  const next = $('.js-next'), prev = $('.js-prev'), summary = $('.js-summary'), steps = $$('.js-steps li'), foot = $('.js-book-foot');
  const TITLES = ['Elige servicio', '¿Con quién?', 'Fecha y hora', 'Tus datos'];

  let st, holdTimer;
  const reset = () => { st = { step: 0, service: null, staff: null, any: false, date: null, time: null, month: null, holdUntil: 0, group: 'all', q: '', customer: {} }; };
  reset();

  const svc = id => D.services.find(s => s.id === id);
  const person = id => D.staff.find(p => p.id === id);
  const canDo = (p, sid) => p.services.includes(sid);
  const toMin = s => { const [h, m] = s.split(':'); return +h * 60 + +m; };
  const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const longDate = d => d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  /* ---------- Agenda simulada (ocupación determinista por día y profesional) ---------- */
  const rand = seed => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const busyCache = {};
  function busy(staffId, date) {
    const k = staffId + ymd(date);
    if (busyCache[k]) return busyCache[k];
    const h = D.hours[date.getDay()]; if (!h) return (busyCache[k] = []);
    const r = rand([...k].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0);
    const out = []; let t = toMin(h[0]);
    while (t < toMin(h[1])) {
      const len = [30, 30, 60, 90, 120][Math.floor(r() * 5)];
      if (r() < 0.55) out.push([t, t + len]);
      t += len;
    }
    return (busyCache[k] = out);
  }
  function slotsFor(staffId, date, dur) {
    const h = D.hours[date.getDay()]; if (!h) return [];
    const b = busy(staffId, date), res = [];
    const nowMin = ymd(date) === ymd(new Date()) ? new Date().getHours() * 60 + new Date().getMinutes() + 120 : -1;
    for (let t = toMin(h[0]); t + dur <= toMin(h[1]); t += STEP_MIN) {
      if (t < nowMin) continue;
      if (!b.some(([s, e]) => t < e && t + dur > s)) res.push(t);
    }
    return res;
  }
  function slots(date) {
    const dur = svc(st.service).min;
    const people = st.any ? D.staff.filter(p => canDo(p, st.service)) : [person(st.staff)];
    const map = new Map();
    people.forEach(p => slotsFor(p.id, date, dur).forEach(t => { if (!map.has(t)) map.set(t, p.id); }));
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }

  /* ---------- Abrir / cerrar ---------- */
  function open(opts = {}) {
    reset();
    if (opts.service) st.service = +opts.service;
    if (opts.staff) { st.staff = +opts.staff; }
    if (st.service && !st.staff) {
      const able = D.staff.filter(p => canDo(p, st.service));
      if (able.length === 1) st.staff = able[0].id;
    }
    st.step = st.service ? (st.staff ? 2 : 1) : 0;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    render();
    setTimeout(() => $('.book__close').focus(), 400);
  }
  function close() {
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    clearInterval(holdTimer);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('.js-book');
    if (b) { e.preventDefault(); open({ service: b.dataset.service, staff: b.dataset.staff }); }
    if (e.target.closest('.js-book-close')) close();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && el.classList.contains('is-open')) close(); });

  /* ---------- Navegación entre pasos ---------- */
  next.addEventListener('click', () => {
    if (st.step === 3) return confirm();
    if (st.step === 0 && st.staff && !canDo(person(st.staff), st.service)) st.staff = null;
    if (st.step === 0) {
      const able = D.staff.filter(p => canDo(p, st.service));
      if (able.length === 1) { st.staff = able[0].id; st.any = false; }
      if (st.staff) { st.step = 2; return render(); }
    }
    st.step++; render();
  });
  prev.addEventListener('click', () => {
    if (st.step === 2 && D.staff.filter(p => canDo(p, st.service)).length === 1) st.step = 0;
    else st.step = Math.max(0, st.step - 1);
    if (st.step < 3) { clearInterval(holdTimer); st.holdUntil = 0; }
    render();
  });

  function valid() {
    if (st.step === 0) return !!st.service;
    if (st.step === 1) return !!(st.staff || st.any);
    if (st.step === 2) return !!st.time;
    if (st.step === 3) return true;
  }
  function updateNav() {
    next.disabled = !valid();
    next.innerHTML = st.step === 3 ? 'Confirmar reserva' : 'Continuar <i class="arrow"></i>';
    prev.style.visibility = st.step === 0 ? 'hidden' : 'visible';
    steps.forEach((li, i) => { li.classList.toggle('is-active', i === st.step); li.classList.toggle('is-done', i < st.step); });
    const s = st.service && svc(st.service);
    const who = st.time ? person(st.time.staff).name : st.any ? 'Cualquier profesional' : st.staff ? person(st.staff).name : '';
    summary.innerHTML = s ? `<b>${s.name}</b><span>${fmtDur(s.min)}${who ? ' · ' + who : ''}${st.time ? ' · ' + st.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ' ' + hhmm(st.time.t) : ''}</span>` : '<span>Selecciona un servicio para empezar</span>';
  }

  function render() {
    title.textContent = TITLES[st.step];
    foot.style.display = '';
    $('.js-steps').style.display = '';
    body.innerHTML = '';
    const wrap = document.createElement('div'); wrap.className = 'step';
    body.append(wrap);
    [renderService, renderStaff, renderDate, renderForm][st.step](wrap);
    body.scrollTop = 0;
    updateNav();
  }

  /* ---------- Paso 1: servicio ---------- */
  function renderService(w) {
    w.innerHTML = `
      <input class="b-search" type="search" placeholder="Buscar: barba, mechas, recogido…" aria-label="Buscar servicio" value="${st.q}">
      <div class="b-tabs" role="tablist">
        <button data-g="all">Todos</button>
        ${D.groups.map(g => `<button data-g="${g.id}">${g.name.split(':')[0].replace(' & ', ' y ')}</button>`).join('')}
      </div>
      <div class="js-list"></div>`;
    const list = $('.js-list', w), input = $('.b-search', w);
    const draw = () => {
      $$('.b-tabs button', w).forEach(b => b.classList.toggle('is-active', b.dataset.g === st.group));
      const q = st.q.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      let html = '';
      D.groups.filter(g => st.group === 'all' || g.id === st.group).forEach(g => {
        const items = D.services.filter(s => s.g === g.id && s.name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(q));
        if (!items.length) return;
        html += `<p class="b-group">${g.name}</p><ul class="b-list">${items.map(s => `<li><button class="b-opt ${st.service === s.id ? 'is-selected' : ''}" data-id="${s.id}"><span>${s.name}</span><small>${fmtDur(s.min)}</small></button></li>`).join('')}</ul>`;
      });
      list.innerHTML = html || '<p class="b-empty">No encontramos ese servicio. Llámanos al 910 401 321 y te ayudamos.</p>';
    };
    input.addEventListener('input', () => { st.q = input.value; draw(); });
    $('.b-tabs', w).addEventListener('click', e => { const b = e.target.closest('button'); if (b) { st.group = b.dataset.g; draw(); } });
    list.addEventListener('click', e => {
      const b = e.target.closest('.b-opt'); if (!b) return;
      st.service = +b.dataset.id; st.time = null;
      $$('.b-opt', list).forEach(o => o.classList.toggle('is-selected', o === b));
      updateNav();
      setTimeout(() => next.click(), 280);
    });
    draw();
  }

  /* ---------- Paso 2: profesional ---------- */
  function renderStaff(w) {
    const able = D.staff.filter(p => canDo(p, st.service));
    w.innerHTML = `<div class="b-staff">
      <button class="b-person ${st.any ? 'is-selected' : ''}" data-any="1"><figure>✦</figure><div><b>Sin preferencia</b><span>Primer hueco libre</span></div></button>
      ${D.staff.map(p => `<button class="b-person ${st.staff === p.id && !st.any ? 'is-selected' : ''}" data-id="${p.id}" ${able.includes(p) ? '' : 'disabled'}><figure><img src="${p.img}" alt=""></figure><div><b>${p.name}</b><span>${able.includes(p) ? (p.id === 1 ? 'Fundador · barbería y color' : 'Estilista · color y peinados') : 'No realiza este servicio'}</span></div></button>`).join('')}
    </div>`;
    w.addEventListener('click', e => {
      const b = e.target.closest('.b-person'); if (!b) return;
      st.any = !!b.dataset.any; st.staff = st.any ? null : +b.dataset.id; st.time = null;
      $$('.b-person', w).forEach(o => o.classList.toggle('is-selected', o === b));
      updateNav(); setTimeout(() => next.click(), 280);
    });
  }

  /* ---------- Paso 3: fecha y hora ---------- */
  function renderDate(w) {
    const t0 = today(), last = new Date(t0); last.setDate(last.getDate() + MAX_DAYS);
    if (!st.month) st.month = new Date(t0.getFullYear(), t0.getMonth(), 1);
    if (!st.date) { // primer día con huecos
      const d = new Date(t0);
      for (let i = 0; i <= MAX_DAYS; i++, d.setDate(d.getDate() + 1)) if (slots(d).length) { st.date = new Date(d); st.month = new Date(d.getFullYear(), d.getMonth(), 1); break; }
    }
    const mth = st.month, first = (mth.getDay() + 6) % 7, dim = new Date(mth.getFullYear(), mth.getMonth() + 1, 0).getDate();
    let cells = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => `<span class="dow">${d}</span>`).join('') + '<span></span>'.repeat(first);
    for (let i = 1; i <= dim; i++) {
      const d = new Date(mth.getFullYear(), mth.getMonth(), i);
      const out = d < t0 || d > last || !D.hours[d.getDay()];
      const n = out ? 0 : slots(d).length;
      cells += `<button class="b-day ${st.date && ymd(d) === ymd(st.date) ? 'is-selected' : ''} ${!out && !n ? 'is-full' : ''}" data-d="${ymd(d)}" ${out || !n ? 'disabled' : ''} aria-label="${longDate(d)}${n ? ', ' + n + ' huecos' : ''}">${i}${out ? '' : '<i></i>'}</button>`;
    }
    const canPrev = mth > new Date(t0.getFullYear(), t0.getMonth(), 1);
    const canNext = new Date(mth.getFullYear(), mth.getMonth() + 1, 1) <= last;
    const list = st.date ? slots(st.date) : [];
    w.innerHTML = `
      <div class="b-month"><button class="js-m" data-dir="-1" ${canPrev ? '' : 'disabled'} aria-label="Mes anterior">‹</button><span>${mth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span><button class="js-m" data-dir="1" ${canNext ? '' : 'disabled'} aria-label="Mes siguiente">›</button></div>
      <div class="b-days">${cells}</div>
      ${st.date ? `<p class="b-group">${longDate(st.date)} · ${list.length} huecos</p>` : ''}
      <div class="b-slots">${list.map(([t, sid]) => `<button class="b-slot ${st.time && st.time.t === t && ymd(st.date) === ymd(st.time.d) ? 'is-selected' : ''}" data-t="${t}" data-s="${sid}">${hhmm(t)}</button>`).join('') || '<p class="b-empty">No quedan huecos este día.</p>'}</div>
      <p class="b-note">Lunes y domingos cerrado. Para citas de más de 3 horas o novias, llámanos al 910 401 321.</p>`;
    w.addEventListener('click', e => {
      const m = e.target.closest('.js-m');
      if (m) { st.month = new Date(mth.getFullYear(), mth.getMonth() + +m.dataset.dir, 1); st.date = null; return render(); }
      const d = e.target.closest('.b-day');
      if (d && !d.disabled) { const [y, mo, da] = d.dataset.d.split('-'); st.date = new Date(+y, mo - 1, +da); st.time = null; return render(); }
      const s = e.target.closest('.b-slot');
      if (s) {
        st.time = { t: +s.dataset.t, staff: +s.dataset.s, d: new Date(st.date) };
        $$('.b-slot', w).forEach(o => o.classList.toggle('is-selected', o === s));
        updateNav(); setTimeout(() => next.click(), 280);
      }
    });
  }

  /* ---------- Paso 4: datos + bloqueo temporal del hueco ---------- */
  function renderForm(w) {
    if (!st.holdUntil) st.holdUntil = Date.now() + HOLD_SECONDS * 1000;
    const c = st.customer;
    w.innerHTML = `
      <div class="b-hold" role="status"><span>⏳</span><span>Hemos reservado este hueco para ti durante <b class="js-hold">5:00</b> mientras completas tus datos.</span></div>
      <form class="b-form" novalidate>
        <div class="b-field"><label for="bn">Nombre y apellidos</label><input id="bn" name="name" autocomplete="name" required value="${c.name || ''}"></div>
        <div class="b-field"><label for="bp">Teléfono</label><input id="bp" name="phone" type="tel" autocomplete="tel" inputmode="tel" required value="${c.phone || ''}"></div>
        <div class="b-field"><label for="be">Email</label><input id="be" name="email" type="email" autocomplete="email" required value="${c.email || ''}"></div>
        <div class="b-field"><label for="bo">Comentarios (opcional)</label><textarea id="bo" name="notes" rows="2" placeholder="Largo de pelo, referencia de color… (no incluyas datos de salud)">${c.notes || ''}</textarea></div>
        <label class="b-check"><input type="checkbox" name="legal" required ${c.legal ? 'checked' : ''}> <span>He leído la <a href="privacidad.html" target="_blank" rel="noopener" style="text-decoration:underline">política de privacidad</a>.</span></label>
        <label class="b-check"><input type="checkbox" name="wa" ${c.wa ? 'checked' : ''}> <span>Quiero recibir la confirmación y el recordatorio también por WhatsApp (opcional).</span></label>
        <p class="b-legal"><b>Información básica sobre protección de datos.</b> Responsable: Francisco Javier López Martín (LOMAR Estilistas). Finalidad: gestionar tu cita y enviarte la confirmación y el recordatorio. Legitimación: tu solicitud de cita y, para WhatsApp, tu consentimiento. Destinatarios: no se ceden datos a terceros, salvo a proveedores que nos prestan servicio (alojamiento web y envío de avisos). Derechos: acceso, rectificación, supresión y otros, escribiendo a hola@lomarestilistas.es. Más información en la <a href="privacidad.html" target="_blank" rel="noopener">política de privacidad</a>.</p>
      </form>`;
    const f = $('form', w);
    f.addEventListener('input', () => { const fd = new FormData(f); st.customer = { ...Object.fromEntries(fd), legal: f.legal.checked, wa: f.wa.checked }; });
    f.addEventListener('submit', e => { e.preventDefault(); next.click(); });
    clearInterval(holdTimer);
    const tick = () => {
      const left = Math.max(0, Math.round((st.holdUntil - Date.now()) / 1000));
      const h = $('.js-hold'); if (h) h.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
      if (!left) {
        clearInterval(holdTimer); st.holdUntil = 0; st.time = null; st.step = 2; render();
        body.insertAdjacentHTML('afterbegin', '<p class="b-hold">El tiempo de bloqueo ha expirado y el hueco se ha liberado. Elige de nuevo tu hora.</p>');
      }
    };
    tick(); holdTimer = setInterval(tick, 1000);
  }

  function confirm() {
    const f = $('.b-form'); let ok = true;
    ['name', 'phone', 'email'].forEach(n => {
      const i = f[n];
      const bad = !i.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)) || (n === 'phone' && i.value.replace(/\D/g, '').length < 9);
      i.classList.toggle('is-invalid', bad); if (bad) ok = false;
    });
    if (!f.legal.checked) { ok = false; f.legal.parentElement.style.color = '#c0472b'; }
    if (!ok) return;
    next.disabled = true; next.textContent = 'Comprobando disponibilidad…';
    // En producción: petición al servidor, que vuelve a validar el hueco dentro de una transacción.
    setTimeout(done, 900);
  }

  /* ---------- Confirmación ---------- */
  function done() {
    clearInterval(holdTimer);
    const s = svc(st.service), p = person(st.time.staff), d = st.time.d, t = st.time.t;
    const start = new Date(d); start.setHours(0, t, 0, 0);
    const end = new Date(start.getTime() + s.min * 60000);
    const code = 'LM-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    title.textContent = '¡Cita reservada!';
    $('.js-steps').style.display = 'none'; foot.style.display = 'none';
    body.innerHTML = `<div class="step b-done">
      <div class="b-done__icon"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg></div>
      <h3>Te esperamos, ${(st.customer.name || '').split(' ')[0]}.</h3>
      <p>Te hemos enviado la confirmación a <b>${st.customer.email}</b>${st.customer.wa ? ' y por WhatsApp' : ''}.</p>
      <dl class="b-card">
        <div><dt>Servicio</dt><dd>${s.name}</dd></div>
        <div><dt>Profesional</dt><dd>${p.name}</dd></div>
        <div><dt>Fecha</dt><dd>${longDate(d)}</dd></div>
        <div><dt>Hora</dt><dd>${hhmm(t)} – ${hhmm(t + s.min)}</dd></div>
        <div><dt>Dirección</dt><dd>C/ Alfaro 11, Pinto</dd></div>
        <div><dt>Localizador</dt><dd>${code}</dd></div>
      </dl>
      <div class="b-done__actions">
        <button class="btn btn--copper js-ics">Añadir al calendario</button>
        <a class="btn btn--outline" target="_blank" rel="noopener" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(s.name + ' · LOMAR Estilistas')}&dates=${gcal(start)}/${gcal(end)}&location=${encodeURIComponent('Calle Alfaro 11, 28320 Pinto, Madrid')}">Google Calendar</a>
      </div>
      <p class="b-note">Te recordaremos la cita 24 h antes. Puedes cambiarla o cancelarla desde el enlace del email.</p>
    </div>`;
    $('.js-ics').addEventListener('click', () => {
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LOMAR Estilistas//Reservas//ES', 'BEGIN:VEVENT', `UID:${code}@lomarestilistas.es`, `DTSTAMP:${gcal(new Date())}`, `DTSTART:${gcal(start)}`, `DTEND:${gcal(end)}`, `SUMMARY:${s.name} · LOMAR Estilistas`, `DESCRIPTION:Con ${p.name}. Localizador ${code}. Tel. 910 401 321`, 'LOCATION:Calle Alfaro 11\\, 28320 Pinto\\, Madrid', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'cita-lomar.ics'; a.click();
    });
  }
  const gcal = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
})();
