<?php
/**
 * LOMAR Estilistas — funciones del tema.
 *
 * @package Lomar
 */

defined( 'ABSPATH' ) || exit;

define( 'LOMAR_VERSION', '1.0.0' );

/* -------------------------------------------------------------------------
 * Configuración básica
 * ---------------------------------------------------------------------- */
add_action(
	'after_setup_theme',
	function () {
		load_theme_textdomain( 'lomar', get_template_directory() . '/languages' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	}
);

/** Título de la portada. */
add_filter(
	'document_title_parts',
	function ( $parts ) {
		if ( is_front_page() ) {
			$parts = array( 'title' => 'LOMAR Estilistas · Peluquería, color y barbería en Pinto' );
		}
		return $parts;
	}
);

/** Descripción para buscadores en la portada. */
add_action(
	'wp_head',
	function () {
		echo '<meta name="theme-color" content="#0d0c0b">' . "\n";
		if ( is_front_page() ) {
			echo '<meta name="description" content="' . esc_attr( 'Peluquería, colorista y barbería en Pinto (Madrid). Cortes, tintes y mechas sin PPD, recogidos, tratamientos Abril et Nature y rituales de barba. Reserva tu cita online.' ) . '">' . "\n";
		}
	},
	1
);

/* -------------------------------------------------------------------------
 * Utilidades de plantilla
 * ---------------------------------------------------------------------- */

/** URL de un archivo del tema (imágenes, etc.). */
function lomar_asset( $path ) {
	return get_theme_file_uri( 'assets/' . ltrim( $path, '/' ) );
}

/** Imprime la URL escapada de una imagen del tema. */
function lomar_img( $file ) {
	echo esc_url( lomar_asset( 'img/' . $file ) );
}

/** Enlace a una sección de la portada (#equipo...) desde cualquier página. */
function lomar_anchor( $id ) {
	return is_front_page() ? '#' . $id : home_url( '/#' . $id );
}

/** URL de una página por su slug (con alternativa si aún no existe). */
function lomar_page_url( $slug ) {
	$page = get_page_by_path( $slug );
	return $page ? get_permalink( $page ) : home_url( '/' . $slug . '/' );
}

/** ¿Está activo Bookly? Entonces la reserva es real; si no, se muestra la simulación. */
function lomar_bookly_active() {
	return shortcode_exists( 'bookly-form' );
}

/** Iconos de redes sociales (mismos enlaces que la web actual). */
function lomar_social() {
	?>
	<div class="social">
		<a href="https://www.facebook.com/315380262516977" target="_blank" rel="noopener" aria-label="LOMAR Estilistas en Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="fill" d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z"/></svg></a>
		<a href="https://www.instagram.com/lomarestilistas" target="_blank" rel="noopener" aria-label="LOMAR Estilistas en Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" class="fill"/></svg></a>
	</div>
	<?php
}

/** Título con la última palabra en cursiva (estilo de la web). */
function lomar_title_em( $title ) {
	$title = trim( wp_strip_all_tags( $title ) );
	$pos   = strrpos( $title, ' ' );
	if ( false === $pos ) {
		return '<em>' . esc_html( $title ) . '</em>';
	}
	return esc_html( substr( $title, 0, $pos ) ) . ' <em>' . esc_html( substr( $title, $pos + 1 ) ) . '</em>';
}

/** Clases del body: cargador solo en portada; cabecera opaca en el resto. */
add_filter(
	'body_class',
	function ( $classes ) {
		$classes[] = is_front_page() ? 'is-loading' : 'page-legal';
		return $classes;
	}
);

/* -------------------------------------------------------------------------
 * Estilos y scripts (todo local: sin Google Fonts ni CDN)
 * ---------------------------------------------------------------------- */
add_action(
	'wp_enqueue_scripts',
	function () {
		$v = LOMAR_VERSION;
		wp_enqueue_style( 'lomar-fonts', lomar_asset( 'css/fonts.css' ), array(), $v );
		wp_enqueue_style( 'lomar-main', lomar_asset( 'css/main.css' ), array( 'lomar-fonts' ), $v );
		wp_enqueue_style( 'lomar-wp', lomar_asset( 'css/wp.css' ), array( 'lomar-main' ), $v );

		// Datos de servicios y profesionales (los mismos que el Bookly actual).
		wp_enqueue_script( 'lomar-data', lomar_asset( 'js/data.js' ), array(), $v, true );
		wp_add_inline_script(
			'lomar-data',
			'window.LOMAR_BASE = ' . wp_json_encode( trailingslashit( get_template_directory_uri() ) ) . ';' .
			'window.LOMAR_URLS = ' . wp_json_encode( array( 'privacy' => lomar_page_url( 'politica-privacidad' ) ) ) . ';',
			'before'
		);

		if ( is_front_page() ) {
			wp_enqueue_script( 'lomar-main', lomar_asset( 'js/main.js' ), array( 'lomar-data' ), $v, true );
		} else {
			wp_enqueue_script( 'lomar-legal', lomar_asset( 'js/legal.js' ), array(), $v, true );
		}

		if ( lomar_bookly_active() ) {
			wp_enqueue_script( 'lomar-bookly', lomar_asset( 'js/bookly-drawer.js' ), array(), $v, true );
		} else {
			wp_enqueue_script( 'lomar-booking', lomar_asset( 'js/booking.js' ), array( 'lomar-data' ), $v, true );
		}
	}
);

/* -------------------------------------------------------------------------
 * Privacidad: sin emojis de WordPress.org (evita peticiones a terceros,
 * coherente con la política de cookies).
 * ---------------------------------------------------------------------- */
add_action(
	'init',
	function () {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		add_filter( 'emoji_svg_url', '__return_false' );
	}
);
add_filter(
	'wp_resource_hints',
	function ( $urls, $relation ) {
		if ( 'dns-prefetch' === $relation ) {
			$urls = array_filter(
				$urls,
				function ( $u ) {
					return false === strpos( is_array( $u ) ? ( $u['href'] ?? '' ) : $u, 's.w.org' );
				}
			);
		}
		return $urls;
	},
	10,
	2
);

/* -------------------------------------------------------------------------
 * Al activar el tema: crear las páginas legales si no existen.
 * ---------------------------------------------------------------------- */
function lomar_create_legal_pages() {
	$pages = array(
		'aviso-legal'         => 'Aviso legal',
		'politica-privacidad' => 'Política de privacidad',
		'politica-de-cookies' => 'Política de cookies',
	);
	$urls = array();
	foreach ( array_keys( $pages ) as $slug ) {
		$urls[ '{{' . $slug . '}}' ] = home_url( '/' . $slug . '/' );
	}
	foreach ( $pages as $slug => $title ) {
		$existing = get_page_by_path( $slug, OBJECT, 'page' );
		if ( $existing && 'trash' !== $existing->post_status ) {
			continue; // No se pisa una página que ya exista.
		}
		$file = get_template_directory() . '/inc/legal/' . $slug . '.html';
		if ( ! file_exists( $file ) ) {
			continue;
		}
		$content = strtr( file_get_contents( $file ), $urls ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		$id      = wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_content' => $content,
			)
		);
		if ( $id && ! is_wp_error( $id ) && 'politica-privacidad' === $slug ) {
			update_option( 'wp_page_for_privacy_policy', $id );
		}
	}
}
add_action( 'after_switch_theme', 'lomar_create_legal_pages' );
