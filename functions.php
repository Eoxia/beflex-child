<?php
/**
 * Child Theme functions
 *
 * @author Eoxia <contact@eoxia.com>
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 * @since 3.0.0
 * @package beflex-child
 */

/**
 * Enqueue style of parent
 *
 * @method theme_enqueue_styles
 * @return void
 */
function theme_enqueue_styles() {
    wp_enqueue_style( 'beflex-parent-style', get_template_directory_uri() . '/assets/css/style.min.css', array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );

/**
 * Enqueue style of child
 *
 * @method theme_enqueue_styles
 * @return void
 */
function theme_child_enqueue_style() {
	/** Styles */
	wp_enqueue_style( 'beflex-child-style', get_stylesheet_directory_uri() . '/assets/css/style.min.css' );
	wp_enqueue_style( 'custom-child-style', get_stylesheet_directory_uri() . '/style.css' );

	/** Scripts */
	wp_enqueue_script( 'beflex-child-js', get_stylesheet_directory_uri() . 'assets/js/theme.js' );
}
add_action( 'wp_enqueue_scripts', 'theme_child_enqueue_style', 11 );

/**
 * Save ACF fields in child theme
 *
 * @method save_acf_child
 * @return string
 */
function save_acf_child() {
	return get_stylesheet_directory() . '/acf-json';
}
add_filter( 'acf/settings/save_json', 'save_acf_child' );

/**
 * Load ACF fields of the parent theme
 *
 * @method load_acf_parent
 * @param  Array $paths paths of files.
 * @return Array $paths paths of files.
 */
function load_acf_parent( $paths ) {
	if ( is_child_theme() ) {
		$paths[] = get_template_directory() . '/acf-json';
		$paths[] = get_stylesheet_directory() . '/acf-json';
	}
	return $paths;
}
add_filter( 'acf/settings/load_json', 'load_acf_parent' );