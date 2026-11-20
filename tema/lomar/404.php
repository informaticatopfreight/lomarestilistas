<?php
/**
 * Página no encontrada.
 *
 * @package Lomar
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main class="legal" id="contenido">
	<div class="wrap">
		<h1>Página no <em>encontrada</em></h1>
		<p>La página que buscas no existe o ha cambiado de dirección.</p>
		<p><a class="btn btn--copper" href="<?php echo esc_url( home_url( '/' ) ); ?>">Volver al inicio</a></p>
	</div>
</main>
<?php
get_footer();
