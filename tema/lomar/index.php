<?php
/**
 * Plantilla general (entradas, archivos y cualquier contenido sin plantilla propia).
 *
 * @package Lomar
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main class="legal" id="contenido">
	<div class="wrap">
		<?php if ( have_posts() ) : ?>
			<?php
			while ( have_posts() ) :
				the_post();
				?>
				<article <?php post_class(); ?>>
					<h1><?php echo lomar_title_em( get_the_title() ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
					<div class="legal__content"><?php is_singular() ? the_content() : the_excerpt(); ?></div>
				</article>
			<?php endwhile; ?>
		<?php else : ?>
			<h1>Sin <em>resultados</em></h1>
			<p><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Volver al inicio</a></p>
		<?php endif; ?>
	</div>
</main>
<?php
get_footer();
