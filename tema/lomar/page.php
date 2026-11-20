<?php
/**
 * Páginas (aviso legal, privacidad, cookies y cualquier otra).
 *
 * @package Lomar
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main class="legal" id="contenido">
	<div class="wrap">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<h1><?php echo lomar_title_em( get_the_title() ); // phpcs:ignore WordPress.Security.EscapeOutput ?></h1>
			<p class="legal__date">Última actualización: <?php echo esc_html( get_the_modified_date( 'j \d\e F \d\e Y' ) ); ?></p>
			<div class="legal__content">
				<?php the_content(); ?>
			</div>
			<?php
		endwhile;
		?>
	</div>
</main>
<?php
get_footer();
