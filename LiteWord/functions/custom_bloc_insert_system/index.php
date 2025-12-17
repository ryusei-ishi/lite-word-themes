<?php
/**
 * Custom Block Insert System
 * Theme version (migrated from plugin)
 */

if (!defined('ABSPATH')) {
    exit;
}

class LW_Custom_Block_Insert_System {

    private $base_path;
    private $base_url;

    public function __construct() {
        $this->base_path = get_template_directory() . '/functions/custom_bloc_insert_system/';
        $this->base_url = get_template_directory_uri() . '/functions/custom_bloc_insert_system/';

        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function enqueue_editor_assets() {
        wp_enqueue_script(
            'lw-custom-block-insert',
            $this->base_url . 'assets/js/editor.js',
            array('wp-plugins', 'wp-edit-post', 'wp-editor', 'wp-element', 'wp-components', 'wp-data', 'wp-blocks', 'wp-dom-ready'),
            filemtime($this->base_path . 'assets/js/editor.js'),
            true
        );

        wp_enqueue_style(
            'lw-custom-block-insert',
            $this->base_url . 'assets/css/editor.css',
            array(),
            filemtime($this->base_path . 'assets/css/editor.css')
        );

        $css_vars = $this->get_css_variables();
        $category_config = $this->get_category_config();
        $premium_status = $this->get_premium_status();

        wp_localize_script('lw-custom-block-insert', 'lwTemplatePutTest', array(
            'restUrl' => rest_url('lw-template-put-test/v1'),
            'nonce' => wp_create_nonce('wp_rest'),
            'blocksBaseUrl' => get_template_directory_uri() . '/my-blocks/build/',
            'resetCssUrl' => get_template_directory_uri() . '/assets/css/reset.min.css',
            'commonCssUrl' => get_template_directory_uri() . '/assets/css/common.min.css',
            'pageCssUrl' => get_template_directory_uri() . '/assets/css/page.min.css',
            'fontStyleCssUrl' => get_template_directory_uri() . '/assets/css/font_style.css',
            'cssVariables' => $css_vars,
            'categoryConfig' => $category_config,
            'premiumStatus' => $premium_status,
        ));
    }

    public function register_rest_routes() {
        register_rest_route('lw-template-put-test/v1', '/templates', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_templates'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
        ));

        register_rest_route('lw-template-put-test/v1', '/preview', array(
            'methods' => 'POST',
            'callback' => array($this, 'get_block_preview'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
        ));

        // Section templates list
        register_rest_route('lw-template-put-test/v1', '/section-templates', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_section_templates'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
        ));

        // Get single section template
        register_rest_route('lw-template-put-test/v1', '/section-templates/(?P<filename>[a-zA-Z0-9_-]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_section_template'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
        ));

        // Preview section template (render HTML)
        register_rest_route('lw-template-put-test/v1', '/section-templates/(?P<filename>[a-zA-Z0-9_-]+)/preview', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_section_template_preview'),
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
        ));
    }

    public function get_templates() {
        // block.json ファイルから動的にブロック一覧を生成
        $build_dir = get_template_directory() . '/my-blocks/build/';
        $block_dirs = glob($build_dir . '*', GLOB_ONLYDIR);

        if (empty($block_dirs)) {
            return rest_ensure_response(array(
                'version' => '2.0',
                'generatedAt' => current_time('c'),
                'totalBlocks' => 0,
                'blocks' => array(),
            ));
        }

        $blocks = array();

        foreach ($block_dirs as $block_dir) {
            $block_json_path = $block_dir . '/block.json';

            if (!file_exists($block_json_path)) {
                continue;
            }

            $json_content = file_get_contents($block_json_path);
            $block_data = json_decode($json_content, true);

            if (json_last_error() !== JSON_ERROR_NONE || empty($block_data['name'])) {
                continue;
            }

            $block_slug = basename($block_dir);

            // ブロックタイプを判定
            $block_type = 'free';
            if (strpos($block_slug, 'paid-block-') === 0) {
                $block_type = 'paid';
            } elseif (strpos($block_slug, 'shin-gas-station-') === 0 || strpos($block_slug, 'lw-pr-') === 0) {
                $block_type = 'premium';
            }

            // プレビュー画像の存在確認（優先順位: sample.webp > preview.webp > preview.png）
            $preview_image = '';
            $sample_webp_path = $block_dir . '/sample.webp';
            $webp_path = $block_dir . '/preview.webp';
            $png_path = $block_dir . '/preview.png';
            if (file_exists($sample_webp_path)) {
                $preview_image = get_template_directory_uri() . '/my-blocks/build/' . $block_slug . '/sample.webp';
            } elseif (file_exists($webp_path)) {
                $preview_image = get_template_directory_uri() . '/my-blocks/build/' . $block_slug . '/preview.webp';
            } elseif (file_exists($png_path)) {
                $preview_image = get_template_directory_uri() . '/my-blocks/build/' . $block_slug . '/preview.png';
            }

            // sampleImage と sampleImageSp を設定（JavaScriptとの互換性）
            $sample_image_pc = '';
            $sample_image_sp = '';
            if ($preview_image) {
                $sample_image_pc = $block_slug . '/' . basename($preview_image);
                // SP用画像も確認（sample-sp.webp）
                $sample_sp_path = $block_dir . '/sample-sp.webp';
                if (file_exists($sample_sp_path)) {
                    $sample_image_sp = $block_slug . '/sample-sp.webp';
                }
            }

            $blocks[] = array(
                'name' => $block_data['name'],
                'slug' => $block_slug,
                'title' => isset($block_data['title']) ? $block_data['title'] : $block_slug,
                'icon' => isset($block_data['icon']) ? $block_data['icon'] : 'block-default',
                'category' => isset($block_data['category']) ? $block_data['category'] : 'common',
                'description' => isset($block_data['description']) ? $block_data['description'] : '',
                'supports' => isset($block_data['supports']) ? $block_data['supports'] : array(),
                'attributes' => isset($block_data['attributes']) ? $block_data['attributes'] : array(),
                'blockType' => $block_type,
                'sampleImage' => $sample_image_pc,
                'sampleImageSp' => $sample_image_sp,
                'no' => isset($block_data['no']) ? intval($block_data['no']) : 9999,
            );
        }

        // ソート: カテゴリー順 → no順 → タイトル順
        usort($blocks, function($a, $b) {
            // 1. カテゴリー順
            $cat_order_a = $this->get_category_sort_order($a['category']);
            $cat_order_b = $this->get_category_sort_order($b['category']);
            if ($cat_order_a !== $cat_order_b) {
                return $cat_order_a - $cat_order_b;
            }
            // 2. no順（block.jsonで指定された並び順）
            if ($a['no'] !== $b['no']) {
                return $a['no'] - $b['no'];
            }
            // 3. タイトル順（フォールバック）
            return strcmp($a['title'], $b['title']);
        });

        return rest_ensure_response(array(
            'version' => '2.0',
            'generatedAt' => current_time('c'),
            'totalBlocks' => count($blocks),
            'blocks' => $blocks,
        ));
    }

    /**
     * カテゴリーのソート順序を取得
     */
    private function get_category_sort_order($category) {
        $order = array(
            'lw-heading' => 1,
            'lw-list' => 2,
            'lw-box' => 3,
            'lw-button' => 4,
            'lw-banner' => 5,
            'lw-cta' => 6,
            'lw-faq' => 7,
            'lw-table' => 8,
            'lw-step' => 9,
            'lw-profile' => 10,
            'lw-firstview' => 11,
            'lw-parts' => 12,
        );
        return isset($order[$category]) ? $order[$category] : 99;
    }

    public function get_block_preview($request) {
        $block_name = $request->get_param('blockName');
        $attributes = $request->get_param('attributes') ?: array();

        $debug = array();
        $debug['blockName'] = $block_name;
        $debug['attributes'] = $attributes;

        if (empty($block_name)) {
            return new WP_Error('no_block_name', 'Block name is required', array('status' => 400));
        }

        $registered_block = WP_Block_Type_Registry::get_instance()->get_registered($block_name);
        $debug['isRegistered'] = $registered_block ? true : false;
        $debug['registeredBlockInfo'] = $registered_block ? array(
            'name' => $registered_block->name,
            'attributes' => $registered_block->attributes,
        ) : null;

        $block_content = '<!-- wp:' . esc_attr($block_name) . ' ' . wp_json_encode($attributes) . ' /-->';
        $debug['blockContent'] = $block_content;

        $rendered = do_blocks($block_content);
        $debug['renderedLength'] = strlen($rendered);
        $debug['renderedPreview'] = substr($rendered, 0, 500);

        $block_slug = str_replace('wdl/', '', $block_name);
        $debug['blockSlug'] = $block_slug;

        $css_url = get_template_directory_uri() . '/my-blocks/build/' . $block_slug . '/style.css';
        $css_path = get_template_directory() . '/my-blocks/build/' . $block_slug . '/style.css';
        $debug['cssPath'] = $css_path;
        $debug['cssExists'] = file_exists($css_path);

        $css_content = '';
        if (file_exists($css_path)) {
            $css_content = file_get_contents($css_path);
            $debug['cssLength'] = strlen($css_content);
        }

        return rest_ensure_response(array(
            'html' => $rendered,
            'cssUrl' => $css_url,
            'cssContent' => $css_content,
            'blockSlug' => $block_slug,
            'debug' => $debug,
        ));
    }

    /**
     * Get list of section templates
     */
    public function get_section_templates() {
        $templates_dir = $this->base_path . 'templates/';

        if (!is_dir($templates_dir)) {
            return rest_ensure_response(array());
        }

        $files = glob($templates_dir . '*.json');
        $templates = array();

        foreach ($files as $file) {
            $filename = basename($file, '.json');
            $json_content = file_get_contents($file);
            $data = json_decode($json_content, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                // Check if new format (has 'blocks' key) or old format (array of blocks)
                $blocks_data = isset($data['blocks']) ? $data['blocks'] : $data;
                $title = isset($data['title']) ? $data['title'] : $this->format_template_name($filename);
                $description = isset($data['description']) ? $data['description'] : '';
                $preview_image = isset($data['previewImage']) ? $data['previewImage'] : '';

                // 同名のwebpファイルが存在するかチェック
                $webp_path = $templates_dir . $filename . '.webp';
                $webp_url = '';
                if (file_exists($webp_path)) {
                    $webp_url = $this->base_url . 'templates/' . $filename . '.webp';
                }

                // pr_から始まるファイル名はプレミアム専用
                $is_premium = strpos($filename, 'pr_') === 0;

                $template_info = array(
                    'filename' => $filename,
                    'name' => $title,
                    'description' => $description,
                    'previewImage' => $preview_image,
                    'previewImageUrl' => $webp_url,
                    'isPremium' => $is_premium,
                    'blockCount' => is_array($blocks_data) ? $this->count_blocks_recursive($blocks_data) : 1,
                    'blocks' => $this->extract_block_names($blocks_data),
                );

                $templates[] = $template_info;
            }
        }

        return rest_ensure_response($templates);
    }

    /**
     * Count blocks recursively including innerBlocks
     */
    private function count_blocks_recursive($blocks) {
        if (!is_array($blocks)) {
            return 0;
        }

        // If single block
        if (isset($blocks['name'])) {
            $blocks = array($blocks);
        }

        $count = count($blocks);
        foreach ($blocks as $block) {
            if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                $count += $this->count_blocks_recursive($block['innerBlocks']);
            }
        }

        return $count;
    }

    /**
     * Get single section template JSON
     */
    public function get_section_template($request) {
        $filename = $request->get_param('filename');
        $file_path = $this->base_path . 'templates/' . $filename . '.json';

        if (!file_exists($file_path)) {
            return new WP_Error('not_found', 'Template not found', array('status' => 404));
        }

        $json_content = file_get_contents($file_path);
        $data = json_decode($json_content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new WP_Error('invalid_json', 'JSON parse error', array('status' => 500));
        }

        // Check if new format (has 'blocks' key) or old format (array of blocks)
        $blocks_data = isset($data['blocks']) ? $data['blocks'] : $data;
        $title = isset($data['title']) ? $data['title'] : $this->format_template_name($filename);

        return rest_ensure_response(array(
            'filename' => $filename,
            'name' => $title,
            'data' => $blocks_data,
        ));
    }

    /**
     * Get section template preview (rendered HTML)
     */
    public function get_section_template_preview($request) {
        $filename = $request->get_param('filename');
        $file_path = $this->base_path . 'templates/' . $filename . '.json';

        if (!file_exists($file_path)) {
            return new WP_Error('not_found', 'Template not found', array('status' => 404));
        }

        $json_content = file_get_contents($file_path);
        $data = json_decode($json_content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new WP_Error('invalid_json', 'JSON parse error', array('status' => 500));
        }

        // Generate block markup for do_blocks
        $block_markup = $this->json_to_block_markup($data);

        // Use do_blocks to render
        $rendered_html = do_blocks($block_markup);

        // Collect CSS files needed
        $css_files = $this->collect_block_css($data);

        return rest_ensure_response(array(
            'filename' => $filename,
            'name' => $this->format_template_name($filename),
            'html' => $rendered_html,
            'cssFiles' => $css_files,
            'debug' => array(
                'markup' => $block_markup,
                'markup_length' => strlen($block_markup),
                'html_length' => strlen($rendered_html),
            ),
        ));
    }

    /**
     * Render blocks directly from JSON data
     */
    private function render_blocks_from_json($blocks) {
        if (!is_array($blocks)) {
            return '';
        }

        // If single block (not array of blocks)
        if (isset($blocks['name'])) {
            $blocks = array($blocks);
        }

        $html = '';
        foreach ($blocks as $block_data) {
            $html .= $this->render_single_block_from_json($block_data);
        }

        return $html;
    }

    /**
     * Render a single block from JSON data
     */
    private function render_single_block_from_json($block_data) {
        $block_name = isset($block_data['name']) ? $block_data['name'] : '';
        $attributes = isset($block_data['attributes']) ? $block_data['attributes'] : array();
        $inner_blocks_data = isset($block_data['innerBlocks']) ? $block_data['innerBlocks'] : array();

        if (empty($block_name)) {
            return '';
        }

        // Build innerBlocks recursively
        $inner_blocks = array();
        foreach ($inner_blocks_data as $inner_block_data) {
            $inner_blocks[] = $this->build_block_array($inner_block_data);
        }

        // Build the block array structure that render_block expects
        $block = array(
            'blockName' => $block_name,
            'attrs' => $attributes,
            'innerBlocks' => $inner_blocks,
            'innerHTML' => '',
            'innerContent' => array(),
        );

        // For blocks with innerBlocks, we need to set up innerContent properly
        if (!empty($inner_blocks)) {
            // Add placeholder for inner blocks
            foreach ($inner_blocks as $inner) {
                $block['innerContent'][] = null; // null indicates inner block position
            }
        }

        return render_block($block);
    }

    /**
     * Build block array recursively for render_block
     */
    private function build_block_array($block_data) {
        $block_name = isset($block_data['name']) ? $block_data['name'] : '';
        $attributes = isset($block_data['attributes']) ? $block_data['attributes'] : array();
        $inner_blocks_data = isset($block_data['innerBlocks']) ? $block_data['innerBlocks'] : array();

        $inner_blocks = array();
        foreach ($inner_blocks_data as $inner_block_data) {
            $inner_blocks[] = $this->build_block_array($inner_block_data);
        }

        $block = array(
            'blockName' => $block_name,
            'attrs' => $attributes,
            'innerBlocks' => $inner_blocks,
            'innerHTML' => '',
            'innerContent' => array(),
        );

        if (!empty($inner_blocks)) {
            foreach ($inner_blocks as $inner) {
                $block['innerContent'][] = null;
            }
        }

        return $block;
    }

    /**
     * Convert JSON blocks to WordPress block markup
     */
    private function json_to_block_markup($blocks) {
        if (!is_array($blocks)) {
            return '';
        }

        // If single block (not array of blocks)
        if (isset($blocks['name'])) {
            $blocks = array($blocks);
        }

        $markup = '';
        foreach ($blocks as $block) {
            $markup .= $this->render_single_block_markup($block);
        }

        return $markup;
    }

    /**
     * Render single block to markup
     */
    private function render_single_block_markup($block) {
        $name = $block['name'];
        $attributes = isset($block['attributes']) ? $block['attributes'] : array();
        $inner_blocks = isset($block['innerBlocks']) ? $block['innerBlocks'] : array();

        $attrs_json = !empty($attributes) ? ' ' . wp_json_encode($attributes) : '';

        if (empty($inner_blocks)) {
            return '<!-- wp:' . $name . $attrs_json . ' /-->' . "\n";
        }

        $inner_content = '';
        foreach ($inner_blocks as $inner_block) {
            $inner_content .= $this->render_single_block_markup($inner_block);
        }

        return '<!-- wp:' . $name . $attrs_json . ' -->' . "\n" . $inner_content . '<!-- /wp:' . $name . ' -->' . "\n";
    }

    /**
     * Collect CSS files for blocks
     */
    private function collect_block_css($blocks) {
        $css_files = array();

        if (!is_array($blocks)) {
            return $css_files;
        }

        if (isset($blocks['name'])) {
            $blocks = array($blocks);
        }

        foreach ($blocks as $block) {
            $this->collect_block_css_recursive($block, $css_files);
        }

        return array_unique($css_files);
    }

    /**
     * Recursively collect CSS files
     */
    private function collect_block_css_recursive($block, &$css_files) {
        $name = $block['name'];

        if (strpos($name, 'wdl/') === 0) {
            $slug = str_replace('wdl/', '', $name);
            $css_path = get_template_directory() . '/my-blocks/build/' . $slug . '/style.css';

            if (file_exists($css_path)) {
                $css_files[] = get_template_directory_uri() . '/my-blocks/build/' . $slug . '/style.css';
            }
        }

        if (!empty($block['innerBlocks'])) {
            foreach ($block['innerBlocks'] as $inner_block) {
                $this->collect_block_css_recursive($inner_block, $css_files);
            }
        }
    }

    /**
     * Format template filename to display name
     */
    private function format_template_name($filename) {
        $name = str_replace(array('_', '-'), ' ', $filename);
        return ucwords($name);
    }

    /**
     * Extract block names from template data
     */
    private function extract_block_names($data) {
        $names = array();

        if (!is_array($data)) {
            return $names;
        }

        if (isset($data['name'])) {
            $data = array($data);
        }

        foreach ($data as $block) {
            if (isset($block['name'])) {
                $names[] = $block['name'];
            }
        }

        return $names;
    }

    private function get_premium_status() {
        $is_subscription_active = false;
        if (function_exists('lw_template_is_active')) {
            $is_subscription_active = lw_template_is_active('paid-lw-parts-sub-hbjkjhkljh', 'sub_pre_set');
        }

        $is_trial_active = false;
        if (function_exists('lw_is_trial_active')) {
            $is_trial_active = lw_is_trial_active();
        }

        $excluded_blocks = array();
        if (function_exists('block_Outright_purchase_only')) {
            $excluded_blocks = block_Outright_purchase_only();
        }

        $purchased_blocks = array();
        if (class_exists('LwTemplateSetting')) {
            $ts = new LwTemplateSetting();
            $purchased_blocks = $ts->get_active_template_ids();
        }

        $premium_info_url = function_exists('lw_premium_info_link')
            ? lw_premium_info_link()
            : 'https://lite-word.com/yuryo-plan/';

        $block_shop_urls = array();
        if (function_exists('lw_block_arr')) {
            $lw_blocks = lw_block_arr();
            foreach ($lw_blocks as $block) {
                if (isset($block['type']) && $block['type'] === 'paid_block' && isset($block['shop_url'])) {
                    $block_shop_urls[$block['id']] = $block['shop_url'];
                }
            }
        }

        return array(
            'isSubscriptionActive' => $is_subscription_active,
            'isTrialActive' => $is_trial_active,
            'isUnlocked' => $is_subscription_active || $is_trial_active,
            'excludedBlocks' => $excluded_blocks,
            'purchasedBlocks' => $purchased_blocks,
            'premiumInfoUrl' => $premium_info_url,
            'blockShopUrls' => $block_shop_urls,
        );
    }

    private function get_category_config() {
        $config = array();
        $category_file = get_template_directory() . '/my-blocks/block-registration/block_category_set.php';

        if (!file_exists($category_file)) {
            return $config;
        }

        $file_content = file_get_contents($category_file);

        if (preg_match_all("/array\s*\(\s*'slug'\s*=>\s*'([^']+)'\s*,\s*'title'\s*=>\s*'([^']+)'/", $file_content, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $index => $match) {
                $slug = $match[1];
                $title = $match[2];
                $display_name = preg_replace('/^LW\s+/', '', $title);
                $config[$slug] = array(
                    'name' => $display_name,
                    'order' => $index + 1,
                );
            }
        }

        return $config;
    }

    private function get_css_variables() {
        $post_id = isset($_GET['post']) ? intval($_GET['post']) : 0;

        $get_color = function($key, $default) use ($post_id) {
            if ($post_id) {
                $meta_value = get_post_meta($post_id, $key, true);
                if (!empty($meta_value) && $meta_value !== '#ada993') {
                    return $meta_value;
                }
            }
            $theme_value = get_theme_mod($key, $default);
            return !empty($theme_value) ? $theme_value : $default;
        };

        return array(
            'colorMain' => $get_color('color_main', '#1a72ad'),
            'colorSub' => $get_color('color_sub', '#0e1013'),
            'colorAccent' => $get_color('color_accent', '#d34a4a'),
            'colorText' => $get_color('color_text', '#060606'),
            'colorPageBgPc' => $get_color('color_page_bg_pc', '#ffffff'),
            'colorPageBgSp' => $get_color('color_page_bg_sp', '#ffffff'),
            'colorContentBgPc' => $get_color('color_content_bg_pc', '#ffffff'),
            'colorContentBgSp' => $get_color('color_content_bg_sp', '#ffffff'),
            'colorLinkCommon' => get_theme_mod('color_link_common', '#0066cc'),
            'colorBackground' => get_theme_mod('color_background', '#f4f4f4'),
            'maxWidthClm1' => get_theme_mod('page_post_layout_max_width_clm_1', '1120px'),
        );
    }

}

new LW_Custom_Block_Insert_System();
