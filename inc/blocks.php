<?php
/**
 * Blocks added to theme
 *
 * @package Beflex
 * @since 4.0.0
 */

/**
 * Require blocks files
 */
//require get_stylesheet_directory() . '/inc/blocks/bf-mega-menu/bf-mega-menu.php';

/**
 * Create custom block category
 * @param $block_categories
 * @param $editor_context
 * @return mixed
 */
function beflex_create_block_category( $block_categories, $editor_context ) {
    if ( ! empty( $editor_context->post ) ) {
        array_unshift(
            $block_categories,
            array(
                'slug'  => 'beflex',
                'title' => __( 'Beflex', 'beflex-child' ),
                'icon'  => 'admin-appearance',
            )
        );
    }
    return $block_categories;
}

add_filter( 'block_categories_all', 'beflex_create_block_category', 10, 2 );