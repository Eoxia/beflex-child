/**
 * Génération automatisée de Blocks WordPress sur le modèle de Beflex
 * Ligne de génération : node inc/generateBlock.js inc/blocks block
*/

const fs = require('fs');
const path = require('path');

function generatePHPFile(folder, fileName, content, keywords) {
    let modifiedContent = content;

    // Remplacer les mots-clés
    Object.keys(keywords).forEach((keyword) => {
        const regex = new RegExp(`{{${keyword}}}`, 'g');
        modifiedContent = modifiedContent.replace(regex, keywords[keyword]);
    });

    const filePath = path.join(folder, fileName);
    fs.writeFileSync(filePath, modifiedContent, 'utf-8');
    console.log(`Fichier ${filePath} généré avec succès.`);
}

function generateVariants(value) {
    const lowerCase = value.toLowerCase();
    const snakeCase = value.replace(/-/g, '_');
    const upperCase = snakeCase.toUpperCase();

    // Ajouter le préfixe "bf-"
    const bfLowerCase = `bf-${lowerCase}`;
    const bfUpperCase = `BF_${upperCase}`;
    const bfSnakeCase = `bf_${snakeCase}`;

    return {
        blockShort: value,
        blockName: bfLowerCase,
        blockVar: bfUpperCase,
        blockFunc: bfSnakeCase
        // blockNameUpperCase: upperCase,
        // blockNameSnakeCase: snakeCase,
        // bfBlockName: bfLowerCase,
        // bfBlockNameUpperCase: bfUpperCase,
        // bfBlockNameSnakeCase: bfSnakeCase
    };

    //     'blockShort': blockShort,
//     'blockName': blockName,
//     'blockVar': blockVar,
//     'blockFunc': blockFunc
}

function generateSCSSFile(folder, keywords) {
    const scssContent = `/** 
 * Style CSS de {{blockName}}
*/`;
    generatePHPFile(path.join(folder, 'assets/scss'), 'style.scss', scssContent, keywords);
}

function generateJSFiles(folder, keywords) {
    const jsContent = `(function($){
    /**
     * initializeBlock
     *
     * Adds custom JavaScript to the block HTML.
     *
     * @param   object $block The block jQuery element.
     * @param   object attributes The block attributes (only available when editing).
     * @return  void
     */
    var initializeBlock = function( $block ) {
    }
    
    // Initialize each block on page load (front end).
    $(document).ready(function(){
        $('.{{blockName}}').each(function(){
            initializeBlock( $(this) );
        });
    });
    
    // Initialize dynamic block preview (editor).
    if( window.acf ) {
        window.acf.addAction( 'render_block_preview/type={{blockName}}', initializeBlock );
    }

})(jQuery);
    `;
    const jsFileName = `${keywords.blockName}.js`; // Utilisation du mot-clé blockName
    generatePHPFile(path.join(folder, 'assets/js'), jsFileName, jsContent, keywords);
}

function generateJsonFile(folder, keywords) {
    const jsonContent = `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "name": "beflex/{{blockShort}}",
  "title": "{{blockShort}}",
  "description": "",
  "style": [ "block-{{blockName}}-style" ],
  "viewScript": [ "block-{{blockName}}-script" ],
  "category": "beflex",
  "icon": "",
  "apiVersion": 2,
  "textdomain": "beflex",
  "keywords": [
    "beflex",
    "{{blockShort}}"
  ],
  "supports": {
  },
  "acf": {
    "mode": "auto",
    "renderTemplate": "../../view.php",
    "postTypes": [
      "post",
      "page"
    ]
  }
}
    `;
    generatePHPFile(path.join(folder, 'assets/json'), 'block.json', jsonContent, keywords);
}

function generatePHPFiles(folder, keywords) {
    const phpContent = `<?php
/**
 * {{blockShort}}
 *
 * @author Eoxia <contact@eoxia.com>
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 * @since 4.0.0
 * @package beflex-child
 *
 */

if ( ! defined( '{{blockVar}}_DIR' ) ) {
    define( '{{blockVar}}_DIR', dirname(__DIR__, 1) . '/{{blockName}}' );
}
if ( ! defined( '{{blockVar}}_URL' ) ) {
    define( '{{blockVar}}_URL', get_stylesheet_directory_uri() . '/inc/blocks/{{blockName}}' );
}

/**
 * Generate block
 *
 * @return void
 */
function {{blockFunc}}_register_acf_blocks() {
    wp_register_style( 'block-{{blockName}}-style', {{blockVar}}_URL . '/assets/css/style.min.css' );
    wp_register_script( 'block-{{blockName}}-script', {{blockVar}}_URL . '/assets/js/{{blockName}}.js', array('jquery'), '', true );
    register_block_type( {{blockVar}}_DIR . '/assets/json/' );
}
add_action( 'init', '{{blockFunc}}_register_acf_blocks', 5 );

/**
 * Load Json fields
 *
 * @param array $paths Json path
 *
 * @return array $paths Json path
 */
function {{blockFunc}}_load_json( $paths ) {
    $paths[] = {{blockVar}}_DIR . '/assets/json';
    return $paths;
}
add_filter( 'acf/settings/load_json', '{{blockFunc}}_load_json' );
    `;
    const phpFileName = `${keywords.blockName}.php`; // Uti
    generatePHPFile(folder, phpFileName, phpContent, keywords);

    const phpContentView = `<?php
/**
 * {{blockShort}}.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during backend preview render.
 * @param   int $post_id The post ID the block is rendering content against.
 *          This is either the post ID currently being displayed inside a query loop,
 *          or the post ID of the post hosting this block.
 * @param   array $context The context provided to the block by the post or its parent block.
 */

// Support custom "anchor" values.
$anchor = '';
if ( ! empty( $block['anchor'] ) ) {
    $anchor = 'id="' . esc_attr( $block['anchor'] ) . '" ';
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = '{{blockName}}';

if ( ! empty( $block['className'] ) ) {
    $class_name .= ' ' . $block['className'];
}
if ( ! empty( $block['align'] ) ) {
    $class_name .= ' align' . $block['align'];
}

// Admin classes
if ( is_admin() ) :
    $class_name .= ' is-admin';
endif;
?>

<div <?php echo $anchor; ?> class="<?php echo esc_attr( $class_name ); ?>">
</div>
    `;
    generatePHPFile(folder, 'view.php', phpContentView, keywords);
}

function generateBlockStructure(destinationFolder, value) {
    const blockFolder = path.join(destinationFolder, `bf-${value}`);
    const assetsFolder = path.join(blockFolder, 'assets');
    const scssFolder = path.join(assetsFolder, 'scss');
    const cssFolder = path.join(assetsFolder, 'css');
    const jsFolder = path.join(assetsFolder, 'js');
    const jsonFolder = path.join(assetsFolder, 'json');

    // Création des dossiers nécessaires
    fs.mkdirSync(blockFolder);
    fs.mkdirSync(assetsFolder);
    fs.mkdirSync(scssFolder);
    fs.mkdirSync(cssFolder);
    fs.mkdirSync(jsFolder);
    fs.mkdirSync(jsonFolder);

    // Génération des variantes
    const variants = generateVariants(value);

    // Génération des fichiers
    generateSCSSFile(blockFolder, variants);
    generateJSFiles(blockFolder, variants);
    generateJsonFile(blockFolder, variants);
    generatePHPFiles(blockFolder, variants);
}

const args = process.argv.slice(2);

// if (args.length < 4) {
//     console.error('Veuillez spécifier le dossier de destination et les valeurs pour blockShort, blockName, blockVar et blockFunc.');
//     process.exit(1);
// }

if (args.length !== 2) {
    console.error('Veuillez spécifier une seule valeur en ligne de commande.');
    process.exit(1);
}

const destinationFolder = args[0];
// const blockShort = args[1];
// const blockName = args[2];
// const blockVar = args[3];
// const blockFunc = args[4];

if (!fs.existsSync(destinationFolder)) {
    console.error(`Le dossier de destination ${destinationFolder} n'existe pas.`);
    process.exit(1);
}

// const keywords = {
//     'blockShort': blockShort,
//     'blockName': blockName,
//     'blockVar': blockVar,
//     'blockFunc': blockFunc
// };

// generateBlockStructure(destinationFolder, keywords);
generateBlockStructure(destinationFolder, args[1]);
