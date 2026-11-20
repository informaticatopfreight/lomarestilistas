<?php
/**
 * Portada.
 *
 * @package Lomar
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main>

<!-- HERO -->
<section class="hero" id="inicio">
  <div class="hero__slides">
    <figure class="hero__slide is-active"><img src="<?php lomar_img( 'barberia.jpg' ); ?>" alt=""></figure>
    <figure class="hero__slide"><img src="<?php lomar_img( 'color-aplicacion.jpg' ); ?>" alt=""></figure>
    <figure class="hero__slide"><img src="<?php lomar_img( 's-peinado.jpg' ); ?>" alt=""></figure>
    <figure class="hero__slide"><img src="<?php lomar_img( 'salon.jpg' ); ?>" alt=""></figure>
  </div>
  <div class="hero__shade"></div>

  <div class="hero__content">
    <p class="eyebrow hero__eyebrow"><span class="dot"></span> Peluquería · Colorista · Barbería — Pinto, Madrid</p>
    <h1 class="hero__title">
      <span class="line"><span>Tu <em class="hero__rotator"><span class="is-active">corte,</span><span>color,</span><span>peinado,</span><span>barba,</span></em></span></span>
      <span class="line"><span>en buenas manos.</span></span>
    </h1>
    <div class="hero__cta">
      <button class="btn btn--light js-book" data-magnetic data-cursor="Reservar">Reservar cita <i class="arrow"></i></button>
      <a class="link-underline" href="#servicios">Ver servicios</a>
    </div>
  </div>

  <div class="hero__bottom">
    <div class="hero__status js-status"><span class="dot"></span><span class="js-status-text">Abierto</span></div>
    <div class="hero__counter"><span class="js-slide-num">01</span><i><b class="js-slide-bar"></b></i><span>04</span></div>
    <a class="hero__scroll" href="#intro">Desliza</a>
  </div>

  <div class="hero__wordmark" aria-hidden="true">LOMAR</div>
</section>

<!-- MARQUEE -->
<div class="marquee" aria-hidden="true">
  <div class="marquee__track js-marquee">
    <span>Corte</span><i>✦</i><span>Color sin PPD</span><i>✦</i><span>Barbería</span><i>✦</i><span>Mechas</span><i>✦</i><span>Recogidos</span><i>✦</i><span>Ritual de barba</span><i>✦</i><span>Tratamientos</span><i>✦</i>
    <span>Corte</span><i>✦</i><span>Color sin PPD</span><i>✦</i><span>Barbería</span><i>✦</i><span>Mechas</span><i>✦</i><span>Recogidos</span><i>✦</i><span>Ritual de barba</span><i>✦</i><span>Tratamientos</span><i>✦</i>
  </div>
</div>

<!-- INTRO -->
<section class="intro section--bone" id="intro">
  <div class="wrap intro__grid">
    <p class="eyebrow">(01) — Quiénes somos</p>
    <p class="intro__text js-words">Pasión, ilusión y constancia. En LOMAR cuidamos tu cabello y tu imagen con <em>expertos</em> en corte, color y barbería — y con una coloración <em>vegana y sin PPD</em> que respeta tu pelo mientras le da vida.</p>
    <figure class="intro__img reveal-img" data-parallax="-0.08">
      <img src="<?php lomar_img( 'javier-trabajando.jpg' ); ?>" alt="Javier cortando el pelo en el salón LOMAR" loading="lazy">
    </figure>
    <div class="intro__aside">
      <img class="intro__brand" src="<?php lomar_img( 'abril-logo.png' ); ?>" alt="Abril et Nature" loading="lazy">
      <p>Somos salón colaborador de <strong>Abril et Nature</strong>, firma española de tratamientos y color veganos. Su coloración no contiene PPD —responsable de la mayoría de picores y alergias— y repara los puentes cistínicos del cabello mientras colorea.</p>
      <a class="link-underline" href="#color">Descubre el color</a>
    </div>
  </div>
</section>

<!-- SERVICIOS -->
<section class="services" id="servicios">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">(02) — Carta de servicios</p>
      <h2 class="h2 split">Todo lo que tu pelo <em>necesita</em>.</h2>
      <p class="section-head__note">Precios según largo y servicio. Consúltalos en el salón o al reservar.</p>
    </div>

    <ul class="svc js-svc">
      <!-- Rellenado por JS desde los datos reales de Bookly -->
    </ul>
  </div>
  <div class="svc-float" aria-hidden="true"><img alt=""></div>
</section>

<!-- COLOR (scroll horizontal) -->
<section class="color" id="color">
  <div class="color__pin">
    <div class="color__intro">
      <p class="eyebrow">(03) — Laboratorio de color</p>
      <h2 class="h2">Color que <em>cuida</em>.</h2>
      <p>Tintes, mechas, matices y decoloraciones con productos veganos Abril et Nature. Sin PPD, sin picores, con brillo.</p>
      <div class="color__swatches" aria-hidden="true">
        <i style="--c:#2b1d14"></i><i style="--c:#5a3520"></i><i style="--c:#8c5a34"></i><i style="--c:#c0784a"></i><i style="--c:#d9b07c"></i><i style="--c:#efdcb8"></i>
      </div>
    </div>
    <div class="color__track js-htrack">
      <article class="ccard"><figure><img src="<?php lomar_img( 's-tinte.jpg' ); ?>" alt="Aplicación de tinte" loading="lazy"></figure><span>01</span><h3>Tinte</h3><p>Raíz o raíz y puntas, solo o con corte y peinado.</p><small>desde 1 h 30 min</small></article>
      <article class="ccard"><figure><img src="<?php lomar_img( 's-mechas.jpg' ); ?>" alt="Mechas" loading="lazy"></figure><span>02</span><h3>Mechas</h3><p>Corto, largo o extra largo. Retoques de zona superior y laterales.</p><small>desde 1 h 30 min</small></article>
      <article class="ccard"><figure><img src="<?php lomar_img( 's-matiz.jpg' ); ?>" alt="Matiz para mechas" loading="lazy"></figure><span>03</span><h3>Matiz</h3><p>El tono exacto para tus mechas: frío, cálido o neutro.</p><small>desde 30 min</small></article>
      <article class="ccard"><figure><img src="<?php lomar_img( 's-decoloracion.jpg' ); ?>" alt="Decoloración" loading="lazy"></figure><span>04</span><h3>Decoloración</h3><p>Aclarados controlados con tratamiento de protección.</p><small>a consultar</small></article>
      <article class="ccard"><figure><img src="<?php lomar_img( 's-alisado.jpg' ); ?>" alt="Alisado orgánico" loading="lazy"></figure><span>05</span><h3>Alisado orgánico</h3><p>Liso, brillante y sin encrespamiento, con activos naturales.</p><small>a consultar</small></article>
      <article class="ccard ccard--cta"><p class="h3">¿No sabes qué color te favorece?</p><button class="btn btn--copper js-book" data-service="91" data-magnetic>Pide diagnóstico capilar</button></article>
    </div>
  </div>
</section>

<!-- EQUIPO -->
<section class="team section--bone" id="equipo">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">(04) — Equipo</p>
      <h2 class="h2 split">Manos que <em>saben</em>.</h2>
    </div>
    <div class="team__grid">
      <article class="member" data-tilt>
        <figure class="member__img">
          <img src="<?php lomar_img( 'javier.jpg' ); ?>" alt="Javier, fundador de LOMAR" loading="lazy">
          <img class="member__alt" src="<?php lomar_img( 'javier-2.jpg' ); ?>" alt="" loading="lazy">
        </figure>
        <div class="member__body">
          <h3 class="member__name">Javier</h3>
          <p class="member__role">Fundador · Oficial de peluquería, estilismo y barbería</p>
          <blockquote>“Me inicié con 14 años gracias a un amigo de la infancia y su madre peluquera. La ilusión es lo que me hizo fundar LOMAR y seguir creciendo.”</blockquote>
          <button class="link-underline js-book" data-staff="1">Reservar con Javier</button>
        </div>
      </article>
      <article class="member" data-tilt>
        <figure class="member__img">
          <img src="<?php lomar_img( 'belen.jpg' ); ?>" alt="Belén, estilista de LOMAR" loading="lazy">
        </figure>
        <div class="member__body">
          <h3 class="member__name">Belén</h3>
          <p class="member__role">Estilista · Color, peinados, recogidos y maquillaje</p>
          <blockquote class="is-pending">[Pendiente: breve presentación de Belén]</blockquote>
          <button class="link-underline js-book" data-staff="7">Reservar con Belén</button>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- GALERÍA -->
<section class="gallery" id="salon">
  <div class="wrap">
    <div class="section-head section-head--row">
      <div>
        <p class="eyebrow">(05) — El salón</p>
        <h2 class="h2 split">Calle Alfaro, <em>11</em>.</h2>
      </div>
      <a class="link-underline" href="https://www.instagram.com/lomarestilistas" target="_blank" rel="noopener">@lomarestilistas</a>
    </div>
  </div>
  <div class="gallery__cols">
    <div class="gcol" data-speed="0.10">
      <figure><img src="<?php lomar_img( 'fachada.jpg' ); ?>" alt="Fachada de LOMAR Estilistas" loading="lazy"></figure>
      <figure><img src="<?php lomar_img( 'barba.jpg' ); ?>" alt="Arreglo de barba" loading="lazy"></figure>
      <figure><img src="<?php lomar_img( 'herramientas.jpg' ); ?>" alt="Herramientas de corte" loading="lazy"></figure>
    </div>
    <div class="gcol" data-speed="-0.12">
      <figure><img src="<?php lomar_img( 'lavacabezas.jpg' ); ?>" alt="Zona de lavado" loading="lazy"></figure>
      <figure><img src="<?php lomar_img( 'tijera.jpg' ); ?>" alt="Corte a tijera" loading="lazy"></figure>
      <figure><img src="<?php lomar_img( 's-recogido.jpg' ); ?>" alt="Recogido" loading="lazy"></figure>
    </div>
    <div class="gcol" data-speed="0.16">
      <figure><img src="<?php lomar_img( 'plancha.jpg' ); ?>" alt="Planchado" loading="lazy"></figure>
      <figure><img src="<?php lomar_img( 'salon.jpg' ); ?>" alt="Tocadores del salón" loading="lazy"></figure>
      <figure><img src="<?php lomar_img( 'secado.jpg' ); ?>" alt="Secado de caballero" loading="lazy"></figure>
    </div>
    <div class="gcol" data-speed="-0.06">
      <figure><img src="<?php lomar_img( 'productos.jpg' ); ?>" alt="Productos Abril et Nature" loading="lazy"></figure>
      <figure><img src="<?php lomar_img( 'lavado.jpg' ); ?>" alt="Lavado" loading="lazy"></figure>
      <figure><img src="<?php lomar_img( 's-caballero.jpg' ); ?>" alt="Corte de caballero" loading="lazy"></figure>
    </div>
  </div>
</section>

<!-- RESEÑAS -->
<section class="reviews section--bone">
  <div class="wrap reviews__inner">
    <p class="eyebrow">(06) — Opiniones</p>
    <p class="reviews__big">Lo que dicen <em>quienes repiten</em>.</p>
    <div class="reviews__placeholder">
      <strong>Reseñas reales de Google</strong>
      <span>Aquí se mostrarán automáticamente las últimas valoraciones de la ficha de Google Business de LOMAR (puntuación media + carrusel).</span>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <div class="cta__marquee" aria-hidden="true"><div class="js-marquee2">¿Reservamos? ✦ ¿Reservamos? ✦ ¿Reservamos? ✦ ¿Reservamos? ✦ ¿Reservamos? ✦ ¿Reservamos? ✦&nbsp;</div></div>
  <div class="wrap cta__inner">
    <p>Elige servicio, profesional y hora en menos de un minuto. Confirmación al instante por email.</p>
    <button class="btn btn--copper btn--xl js-book" data-magnetic data-cursor="Reservar">Reservar cita online <i class="arrow"></i></button>
    <a class="link-underline" href="https://wa.me/34910401321">o escríbenos por WhatsApp</a>
  </div>
</section>

<!-- CONTACTO -->
<section class="contact" id="contacto">
  <div class="wrap contact__grid">
    <div>
      <p class="eyebrow">(07) — Contacto</p>
      <h2 class="h2">Ven a <em>vernos</em>.</h2>
      <address>
        Calle Alfaro 11<br>28320 Pinto, Madrid
      </address>
      <p class="contact__links">
        <a href="tel:+34910401321">910 401 321</a>
        <a href="mailto:hola@lomarestilistas.es">hola@lomarestilistas.es</a>
        <a href="https://www.instagram.com/lomarestilistas" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.facebook.com/315380262516977" target="_blank" rel="noopener">Facebook</a>
      </p>
      <a class="btn btn--outline" href="https://www.google.com/maps/search/?api=1&query=Calle+Alfaro+11+Pinto+Madrid" target="_blank" rel="noopener">Cómo llegar <i class="arrow"></i></a>
    </div>
    <div>
      <table class="hours js-hours">
        <caption class="eyebrow">Horario</caption>
        <tr data-d="1"><th>Lunes</th><td>Cerrado</td></tr>
        <tr data-d="2"><th>Martes</th><td>10:00 – 20:00</td></tr>
        <tr data-d="3"><th>Miércoles</th><td>10:00 – 20:00</td></tr>
        <tr data-d="4"><th>Jueves</th><td>10:00 – 20:00</td></tr>
        <tr data-d="5"><th>Viernes</th><td>10:00 – 20:00</td></tr>
        <tr data-d="6"><th>Sábado</th><td>9:00 – 14:00</td></tr>
        <tr data-d="0"><th>Domingo</th><td>Cerrado</td></tr>
      </table>
      <a class="map" href="https://www.google.com/maps/search/?api=1&query=Calle+Alfaro+11+Pinto+Madrid" target="_blank" rel="noopener" data-cursor="Mapa" style="position:relative;display:block">
        <img src="<?php lomar_img( 'fachada.jpg' ); ?>" alt="Fachada de LOMAR Estilistas en Calle Alfaro 11" loading="lazy" style="width:100%;height:100%;object-fit:cover">
        <span style="position:absolute;left:16px;bottom:16px;background:var(--bone);color:var(--ink);padding:10px 16px;border-radius:99px;font-size:12px;letter-spacing:.14em;text-transform:uppercase">Abrir en Google Maps ↗</span>
      </a>
    </div>
  </div>
</section>
</main>

<?php
get_footer();
