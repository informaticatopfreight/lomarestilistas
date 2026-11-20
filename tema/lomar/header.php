<?php
/**
 * Cabecera común: logo, menú, redes, teléfono y botón de reserva.
 *
 * @package Lomar
 */

defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>/* Si se entra por http://, pasar a https:// */if(location.protocol==="http:"&&!/^(localhost|127\.0\.0\.1)$/.test(location.hostname))location.replace("https://"+location.host+location.pathname+location.search+location.hash);</script>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php if ( is_front_page() ) : ?>
<div class="loader" aria-hidden="true">
	<div class="loader__word"><span>L</span><span>O</span><span>M</span><span>A</span><span>R</span></div>
	<div class="loader__count"><span class="js-count">0</span>%</div>
</div>
<div class="cursor" aria-hidden="true"><span class="cursor__label"></span></div>
<?php endif; ?>

<?php if ( ! lomar_bookly_active() ) : ?>
<div class="proto-badge" role="note">Prototipo de diseño · las reservas son simuladas</div>
<?php endif; ?>

<header class="nav">
	<a class="nav__logo" href="<?php echo esc_url( is_front_page() ? '#inicio' : home_url( '/' ) ); ?>" aria-label="LOMAR Estilistas, inicio">
		<img src="<?php lomar_img( 'logo-blanco.png' ); ?>" alt="LOMAR Estilistas" width="64" height="64">
	</a>
	<nav class="nav__links" aria-label="Principal">
		<a href="<?php echo esc_url( lomar_anchor( 'equipo' ) ); ?>">Equipo</a>
		<a href="<?php echo esc_url( lomar_anchor( 'servicios' ) ); ?>">Servicios</a>
		<a href="<?php echo esc_url( lomar_anchor( 'color' ) ); ?>">Color</a>
		<a href="<?php echo esc_url( lomar_anchor( 'salon' ) ); ?>">El salón</a>
		<a href="<?php echo esc_url( lomar_anchor( 'contacto' ) ); ?>">Contacto</a>
	</nav>
	<div class="nav__actions">
		<?php lomar_social(); ?>
		<a class="nav__tel" href="tel:+34910401321">910 401 321</a>
		<button class="btn btn--copper js-book" data-magnetic>Reservar cita</button>
		<button class="nav__burger js-menu" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button>
	</div>
</header>

<div class="menu" aria-hidden="true">
	<nav>
		<a href="<?php echo esc_url( lomar_anchor( 'equipo' ) ); ?>"><small>01</small>Equipo</a>
		<a href="<?php echo esc_url( lomar_anchor( 'servicios' ) ); ?>"><small>02</small>Servicios</a>
		<a href="<?php echo esc_url( lomar_anchor( 'color' ) ); ?>"><small>03</small>Color</a>
		<a href="<?php echo esc_url( lomar_anchor( 'salon' ) ); ?>"><small>04</small>El salón</a>
		<a href="<?php echo esc_url( lomar_anchor( 'contacto' ) ); ?>"><small>05</small>Contacto</a>
	</nav>
	<div class="menu__foot">
		<a href="tel:+34910401321">910 401 321</a>
		<?php lomar_social(); ?>
	</div>
</div>
