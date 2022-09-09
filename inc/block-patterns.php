<?php
/**
 * Block patterns
 *
 * @package Beflex
 * @since 4.0.0
 */

function beflex_child_register_block_patterns() {
    $block_pattern_categories = array(
        'beflex' => array( 'label' => __( 'Beflex', 'beflex-child' ) )
    );

    /**
     * Filters the theme block pattern categories.
     *
     * @since Twenty Twenty-Two 1.0
     *
     * @param array[] $block_pattern_categories {
     *     An associative array of block pattern categories, keyed by category name.
     *
     *     @type array[] $properties {
     *         An array of block category properties.
     *
     *         @type string $label A human-readable label for the pattern category.
     *     }
     * }
     */
    $block_pattern_categories = apply_filters( 'beflex_block_pattern_categories', $block_pattern_categories );

    foreach ( $block_pattern_categories as $name => $properties ) {
        if ( ! WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $name ) ) {
            register_block_pattern_category( $name, $properties );
        }
    }

    /**
     * Name of file patterns
     */
    $block_patterns = array(
    );

    /**
     * Filters the theme block patterns.
     *
     * @since Twenty Twenty-Two 1.0
     *
     * @param array $block_patterns List of block patterns by name.
     */
    $block_patterns = apply_filters( 'beflex_block_patterns', $block_patterns );

    foreach ( $block_patterns as $block_pattern ) {
        $pattern_file = get_theme_file_path( '/inc/patterns/' . $block_pattern . '.php' );

        register_block_pattern(
            'beflex/' . $block_pattern,
            require $pattern_file
        );
    }
}
add_action( 'init', 'beflex_child_register_block_patterns', 9 );

/**
 * Unregister block pattern category
 */
add_action('init', 'removeCorePatterns');

function removeCorePatterns() {
    remove_theme_support('core-block-patterns');

    unregister_block_pattern_category('buttons');
    unregister_block_pattern_category('columns');
    unregister_block_pattern_category('gallery');
    unregister_block_pattern_category('header');
    unregister_block_pattern_category('text');
}
