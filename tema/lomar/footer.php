<?php
/**
 * Pie común y panel de reserva.
 *
 * @package Lomar
 */

defined( 'ABSPATH' ) || exit;
?>
<footer class="footer">
	<div class="wrap footer__top">
		<img src="<?php lomar_img( 'logo-blanco.png' ); ?>" alt="LOMAR Estilistas" width="120" height="120" loading="lazy">
		<p class="footer__claim">Peluquería, colorista<br>y barbería en Pinto.</p>
		<button class="btn btn--light js-book" data-magnetic>Reservar cita</button>
	</div>
	<div class="wrap footer__bottom">
		<span>© <?php echo esc_html( wp_date( 'Y' ) ); ?> LOMAR Estilistas</span>
		<nav>
			<a href="<?php echo esc_url( lomar_page_url( 'aviso-legal' ) ); ?>">Aviso legal</a>
			<a href="<?php echo esc_url( lomar_page_url( 'politica-privacidad' ) ); ?>">Privacidad</a>
			<a href="<?php echo esc_url( lomar_page_url( 'politica-de-cookies' ) ); ?>">Cookies</a>
		</nav>
	</div>
</footer>

<div class="book<?php echo lomar_bookly_active() ? ' book--bookly' : ''; ?>" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="book-title">
	<div class="book__backdrop js-book-close"></div>
	<aside class="book__panel">
		<?php if ( lomar_bookly_active() ) : ?>
			<header class="book__head">
				<div>
					<p class="eyebrow">Reserva online</p>
					<h2 id="book-title" class="book__title">Reserva tu cita</h2>
				</div>
				<button class="book__close js-book-close" aria-label="Cerrar">✕</button>
			</header>
			<div class="book__body book__body--bookly">
				<?php echo do_shortcode( '[bookly-form]' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			</div>
		<?php else : ?>
			<header class="book__head">
				<div>
					<p class="eyebrow">Reserva online · Simulación</p>
					<h2 id="book-title" class="book__title js-book-title">Elige servicio</h2>
				</div>
				<button class="book__close js-book-close" aria-label="Cerrar">✕</button>
			</header>
			<ol class="book__steps js-steps">
				<li class="is-active">Servicio</li><li>Profesional</li><li>Fecha y hora</li><li>Tus datos</li>
			</ol>
			<div class="book__body js-book-body"></div>
			<footer class="book__foot js-book-foot">
				<div class="book__summary js-summary"></div>
				<div class="book__nav">
					<button class="btn btn--ghost js-prev">Atrás</button>
					<button class="btn btn--copper js-next" disabled>Continuar</button>
				</div>
			</footer>
		<?php endif; ?>
	</aside>
</div>

<?php wp_footer(); ?>
</body>
</html>
