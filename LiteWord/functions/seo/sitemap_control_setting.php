<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * サイトマップ管理画面（修正版）
 */

// 必要なクラスの読み込み
require_once get_template_directory() . '/functions/seo/sitemap_settings_class.php';

// プレミアム契約チェック
$is_premium = defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true;

if ( ! $is_premium ) : ?>
    <div class="wrap">
        <div class="none_plugin_message"></div>
        <h1>サイトマップ管理</h1>
        <div class="lw-premium-notice">
            <div class="premium-lock-icon">🔒</div>
            <h2>この機能はLiteWordプレミアム限定です！</h2>
            <p>サイトマップの詳細管理機能をご利用いただくには、LiteWordプレミアムへのアップグレードが必要です。</p>
            <a href="<?=admin_url('index.php?show_premium_popup=1')?>" class="button button-primary" <?=new_tab()?>>プレミアムプランを見る</a>
        </div>
        <style>
            .lw-premium-notice {
                text-align: center;
                padding: 60px 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
                margin-top: 40px;
            }
            .premium-lock-icon { font-size: 48px; margin-bottom: 20px; }
            .lw-premium-notice h2 { color: white; font-size: 28px; margin-bottom: 15px; }
            .lw-premium-notice p { font-size: 16px; margin-bottom: 30px; }
            .lw-premium-notice .button-primary {
                background: white;
                color: #667eea;
                border: none;
                font-size: 16px;
                padding: 12px 30px;
                height: auto;
            }
        </style>
    </div>
    <?php
    return;
endif;

// 設定保存処理
if ( isset( $_POST['lw_sitemap_settings_nonce'] ) && wp_verify_nonce( $_POST['lw_sitemap_settings_nonce'], 'lw_sitemap_settings' ) ) {
    $new_settings = [
        'changefreq' => $_POST['changefreq'] ?? [],
        'priority' => $_POST['priority'] ?? [],
        'exclude' => $_POST['exclude'] ?? [],
        'images' => $_POST['images'] ?? [],
        'ping' => $_POST['ping'] ?? [],
        'cache' => $_POST['cache'] ?? [],
        'advanced' => $_POST['advanced'] ?? []
    ];
    
    LW_Sitemap_Settings::save_settings( $new_settings );
    echo '<div class="notice notice-success"><p>設定を保存しました。</p></div>';
}
// サイトマップ管理画面の上部、保存処理部分に追加
if (isset($_POST['lw_llms_settings_nonce']) && wp_verify_nonce($_POST['lw_llms_settings_nonce'], 'lw_llms_settings')) {
    
    // llms.txt設定の保存
    if (isset($_POST['save_llms_settings']) || isset($_POST['generate_llms_txt'])) {
        $settings = LW_Sitemap_Settings::get_settings();
        
        // llms設定の更新
        $settings['llms'] = [
            'enable_llms_txt' => isset($_POST['llms']['enable_llms_txt']),
            'allow_ai_crawling' => isset($_POST['llms']['allow_ai_crawling']),
            'allowed_agents' => $_POST['llms']['allowed_agents'] ?? [],
            'disallowed_paths' => array_filter(array_map('trim', explode("\n", $_POST['llms']['disallowed_paths'] ?? ''))),
            'crawl_delay' => intval($_POST['llms']['crawl_delay'] ?? 1),
            'custom_rules' => sanitize_textarea_field($_POST['llms']['custom_rules'] ?? ''),
            'sitemap_reference' => isset($_POST['llms']['sitemap_reference']),
        ];
        
        LW_Sitemap_Settings::save_settings($settings);
        
        // llms.txtを生成
        if (isset($_POST['generate_llms_txt'])) {
            if (LW_Sitemap_Settings::generate_llms_txt()) {
                echo '<div class="notice notice-success"><p>llms.txtを生成しました。</p></div>';
            } else {
                echo '<div class="notice notice-error"><p>llms.txtの生成に失敗しました。書き込み権限を確認してください。</p></div>';
            }
        } else {
            echo '<div class="notice notice-success"><p>llms.txt設定を保存しました。</p></div>';
        }
    }
}

// 投稿公開時にllms.txtも更新
add_action('publish_post', function($post_id) {
    $settings = LW_Sitemap_Settings::get_settings();
    
    // 自動更新が有効な場合
    if ($settings['llms']['enable_llms_txt'] && $settings['cache']['auto_regenerate']) {
        LW_Sitemap_Settings::generate_llms_txt();
    }
});
// Ping送信処理
if ( isset( $_POST['send_ping'] ) && wp_verify_nonce( $_POST['ping_nonce'] ?? '', 'send_ping' ) ) {
    $results = LW_Sitemap_Settings::send_ping();
    $success = array_filter( $results );
    if ( count( $success ) > 0 ) {
        echo '<div class="notice notice-success"><p>Ping送信に成功しました。</p></div>';
    } else {
        echo '<div class="notice notice-error"><p>Ping送信に失敗しました。</p></div>';
    }
}

// キャッシュクリア処理
if ( isset( $_POST['clear_cache'] ) && wp_verify_nonce( $_POST['cache_nonce'] ?? '', 'clear_cache' ) ) {
    LW_Sitemap_Settings::clear_cache();
    if ( class_exists( 'LW_SEO_Sitemap_Control' ) ) {
        LW_SEO_Sitemap_Control::rebuild_noindex_cache();
    }
    echo '<div class="notice notice-success"><p>キャッシュをクリアしました。</p></div>';
}

// 現在の設定を取得
$settings = LW_Sitemap_Settings::get_settings();

// ヘルパー関数
if ( ! function_exists( 'lw_get_noindex_status' ) ) {
    function lw_get_noindex_status( $type, $id ) {
        switch ( $type ) {
            case 'post':
            case 'page':
                $value = get_post_meta( $id, 'seo_noindex', true );
                return ( $value === 'noindex' );
            
            case 'category':
                $value = get_term_meta( $id, 'category_noindex', true );
                return ( $value === 'noindex' );
                
            case 'tag':
                $value = get_term_meta( $id, 'term_noindex', true );
                return ( $value === 'noindex' );
            
            case 'author':
                $value = get_user_meta( $id, 'user_noindex', true );
                return ( $value !== 'follow' );
                
            default:
                return false;
        }
    }
}

// 固定ページの階層構造関数
if ( ! function_exists( 'lw_build_page_tree' ) ) {
    function lw_build_page_tree( $parent = 0, $level = 0, $children_map = null ) {
        // 最初の呼び出し時に全ページの子マップを作成してN+1クエリを回避
        static $page_children_map = null;
        if ( $level === 0 && $children_map === null ) {
            $page_children_map = [];
            $all_pages = get_pages([
                'post_status' => 'publish',
                'sort_column' => 'menu_order,post_title',
            ]);
            foreach ( $all_pages as $p ) {
                if ( $p->post_parent > 0 ) {
                    if ( ! isset( $page_children_map[$p->post_parent] ) ) {
                        $page_children_map[$p->post_parent] = [];
                    }
                    $page_children_map[$p->post_parent][] = $p;
                }
            }
        } elseif ( $children_map !== null ) {
            $page_children_map = $children_map;
        }

        $pages = get_pages([
            'parent'      => $parent,
            'post_status' => 'publish',
            'sort_column' => 'menu_order,post_title',
        ]);

        if ( empty( $pages ) ) return '';

        $output = '<ul class="tree-list level-' . $level . '" data-level="' . $level . '">';

        foreach ( $pages as $page ) {
            // キャッシュマップを使用してN+1クエリを回避
            $has_children = isset( $page_children_map[$page->ID] ) && ! empty( $page_children_map[$page->ID] );
            $is_noindex = lw_get_noindex_status( 'page', $page->ID );
            
            $output .= '<li class="tree-item' . ($has_children ? ' has-children' : '') . '">';
            $output .= '<div class="item-content">';
            
            if ( $has_children ) {
                $output .= '<button class="tree-toggle" aria-expanded="true">▼</button>';
            } else {
                $output .= '<span class="tree-indent"></span>';
            }
            
            $output .= '<a href="' . get_permalink( $page->ID ) . '" target="_blank" class="item-title">';
            $output .= esc_html( $page->post_title );
            $output .= '</a>';
            
            $output .= '<label class="toggle-switch">';
            $output .= '<input type="checkbox" class="noindex-toggle" ';
            $output .= 'data-type="page" data-id="' . $page->ID . '" ';
            $output .= checked( ! $is_noindex, true, false ) . '>';
            $output .= '<span class="toggle-slider"></span>';
            $output .= '<span class="toggle-label">' . ($is_noindex ? 'noindex' : 'index') . '</span>';
            $output .= '</label>';
            
            $output .= '</div>';

            if ( $has_children ) {
                $output .= lw_build_page_tree( $page->ID, $level + 1, $page_children_map );
            }

            $output .= '</li>';
        }

        $output .= '</ul>';
        return $output;
    }
}

// カテゴリーと投稿の階層構造関数
if ( ! function_exists( 'lw_build_category_tree' ) ) {
    function lw_build_category_tree( $parent = 0, $level = 0 ) {
        $categories = get_categories([
            'parent'     => $parent,
            'hide_empty' => false,
            'orderby'    => 'term_order',
        ]);
        
        if ( empty( $categories ) ) return '';
        
        $output = '<ul class="tree-list level-' . $level . '" data-level="' . $level . '">';
        
        foreach ( $categories as $category ) {
            // パフォーマンス最適化：投稿数は$category->countから取得
            $has_posts = $category->count > 0;
            $children = get_categories(['parent' => $category->term_id]);
            $has_children = $has_posts || ! empty( $children );
            $is_noindex = lw_get_noindex_status( 'category', $category->term_id );

            // 投稿リストは必要な時のみ取得（100件に制限）
            $posts = [];
            if ( $has_posts ) {
                $posts = get_posts([
                    'category'       => $category->term_id,
                    'posts_per_page' => 100,
                    'post_status'    => 'publish',
                ]);
            }
            
            $output .= '<li class="tree-item category-item' . ($has_children ? ' has-children' : '') . '">';
            $output .= '<div class="item-content">';
            
            if ( $has_children ) {
                $output .= '<button class="tree-toggle" aria-expanded="true">▼</button>';
            } else {
                $output .= '<span class="tree-indent"></span>';
            }
            
            $output .= '<a href="' . get_category_link( $category->term_id ) . '" target="_blank" class="item-title item-category">';
            $output .= '📁 ' . esc_html( $category->name );
            $output .= '</a>';
            
            $output .= '<label class="toggle-switch">';
            $output .= '<input type="checkbox" class="noindex-toggle" ';
            $output .= 'data-type="category" data-id="' . $category->term_id . '" ';
            $output .= checked( ! $is_noindex, true, false ) . '>';
            $output .= '<span class="toggle-slider"></span>';
            $output .= '<span class="toggle-label">' . ($is_noindex ? 'noindex' : 'index') . '</span>';
            $output .= '</label>';
            
            $output .= '</div>';
            
            if ( $has_children ) {
                $output .= '<ul class="tree-list level-' . ($level + 1) . '">';
                
                foreach ( $posts as $post ) {
                    $is_post_noindex = lw_get_noindex_status( 'post', $post->ID );
                    
                    $output .= '<li class="tree-item post-item">';
                    $output .= '<div class="item-content">';
                    $output .= '<span class="tree-indent"></span>';
                    
                    $output .= '<a href="' . get_permalink( $post->ID ) . '" target="_blank" class="item-title">';
                    $output .= '📄 ' . esc_html( $post->post_title );
                    $output .= '</a>';
                    
                    $output .= '<label class="toggle-switch">';
                    $output .= '<input type="checkbox" class="noindex-toggle" ';
                    $output .= 'data-type="post" data-id="' . $post->ID . '" ';
                    $output .= checked( ! $is_post_noindex, true, false ) . '>';
                    $output .= '<span class="toggle-slider"></span>';
                    $output .= '<span class="toggle-label">' . ($is_post_noindex ? 'noindex' : 'index') . '</span>';
                    $output .= '</label>';
                    
                    $output .= '</div>';
                    $output .= '</li>';
                }
                
                if ( ! empty( $children ) ) {
                    foreach ( $children as $child ) {
                        $child_html = lw_build_category_tree( $child->term_id, $level + 1 );
                        $child_html = preg_replace('/<\/?ul[^>]*>/', '', $child_html);
                        $output .= $child_html;
                    }
                }
                
                $output .= '</ul>';
            }
            
            $output .= '</li>';
        }
        
        $output .= '</ul>';
        return $output;
    }
}

// サイトマップ有効チェック
$is_sitemap_disabled = get_option( 'blog_public' ) == '0';

// CSS読み込み
if ( file_exists( get_template_directory() . '/functions/seo/css/sitemap-control.css' ) ) {
    echo '<link rel="stylesheet" href="' . get_template_directory_uri() . '/functions/seo/css/sitemap-control.css?ver=' . time() . '">';
}

// インデックスされた投稿者数を取得する関数
function get_indexed_users_count() {
    global $wpdb;
    $indexed_users = $wpdb->get_col(
        "SELECT user_id 
         FROM {$wpdb->usermeta} 
         WHERE meta_key = 'user_noindex' 
           AND meta_value = 'follow'"
    );
    return count($indexed_users);
}

?>

<div class="wrap lw-sitemap-control">
    <div class="none_plugin_message"></div>
    <h1>サイトマップ管理</h1>
    <p class="description">XMLサイトマップの詳細設定とインデックス管理を行います。</p>
    
    <?php if ( $is_sitemap_disabled ) : ?>
    <div class="notice notice-warning">
        <p>⚠️ 検索エンジンへの表示が無効になっています。サイトマップを有効にするには、設定 → 表示設定で「検索エンジンでの表示」のチェックを外してください。</p>
    </div>
    <?php endif; ?>
    
    <!-- 統計情報 -->
    <div class="sitemap-stats">
        <div class="stat-card">
            <span class="stat-label">総ページ数</span>
            <span class="stat-value" id="total-pages">-</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">インデックス</span>
            <span class="stat-value" id="indexed-pages">-</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">noindex</span>
            <span class="stat-value" id="noindex-pages">-</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">最終更新</span>
            <span class="stat-value" id="last-update" style="font-size: 1.2em;">
                <?php 
                $cache = get_option( 'lw_noindex_cache' );
                echo isset($cache['updated_at']) ? date('Y/m/d H:i', strtotime($cache['updated_at'])) : '未実行';
                ?>
            </span>
        </div>
    </div>
    
    <!-- メインタブ -->
    <div class="sitemap-tabs main-tabs">
        <button class="tab-button active" data-tab="index-control">インデックス制御</button>
        <button class="tab-button" data-tab="basic-settings">基本設定</button>
        <button class="tab-button" data-tab="advanced-settings">高度な設定</button>
        <button class="tab-button" data-tab="llms-settings">🤖 llms.txt設定</button>
        <button class="tab-button" data-tab="tools">ツール</button>
    </div>
    
    <div class="sitemap-content">
        
        <!-- インデックス制御タブ -->
        <div id="tab-index-control" class="tab-panel active">
            <div class="sub-tabs sitemap-tabs">
                <button class="tab-button sub-tab active" data-tab="pages">固定ページ</button>
                <button class="tab-button sub-tab" data-tab="posts">投稿・カテゴリー</button>
                <button class="tab-button sub-tab" data-tab="taxonomies">タグ</button>
                <button class="tab-button sub-tab" data-tab="users">投稿者</button>
            </div>
            
            <div class="sub-content">
                <!-- 固定ページサブタブ -->
                <div id="subtab-pages" class="sub-panel active">
                    <div class="panel-header">
                        <h2>📄 固定ページ</h2>
                        <button class="expand-all">すべて展開</button>
                    </div>
                    <div class="tree-container">
                        <?php 
                        $page_tree = lw_build_page_tree();
                        echo $page_tree ?: '<p style="padding: 20px; color: #666;">固定ページがありません</p>';
                        ?>
                    </div>
                </div>
                
                <!-- 投稿・カテゴリーサブタブ -->
                <div id="subtab-posts" class="sub-panel" style="display: none;">
                    <div class="panel-header">
                        <h2>📝 投稿・カテゴリー</h2>
                        <button class="expand-all">すべて展開</button>
                    </div>
                    <div class="tree-container">
                        <?php 
                        $category_tree = lw_build_category_tree();
                        echo $category_tree ?: '<p style="padding: 20px; color: #666;">投稿・カテゴリーがありません</p>';
                        ?>
                    </div>
                </div>
                
                <!-- タグサブタブ -->
                <div id="subtab-taxonomies" class="sub-panel" style="display: none;">
                    <div class="panel-header">
                        <h2>🏷️ タグ</h2>
                    </div>
                    <div class="tree-container">
                        <ul class="tree-list level-0">
                            <?php
                            $tags = get_tags(['hide_empty' => false]);
                            if ( $tags ) :
                                foreach ( $tags as $tag ) :
                                    $is_noindex = lw_get_noindex_status( 'tag', $tag->term_id );
                            ?>
                            <li class="tree-item">
                                <div class="item-content">
                                    <span class="tree-indent"></span>
                                    <a href="<?php echo get_tag_link( $tag->term_id ); ?>" target="_blank" class="item-title">
                                        🏷️ <?php echo esc_html( $tag->name ); ?>
                                    </a>
                                    <label class="toggle-switch">
                                        <input type="checkbox" class="noindex-toggle" 
                                            data-type="tag" data-id="<?php echo $tag->term_id; ?>" 
                                            <?php checked( ! $is_noindex, true ); ?>>
                                        <span class="toggle-slider"></span>
                                        <span class="toggle-label"><?php echo $is_noindex ? 'noindex' : 'index'; ?></span>
                                    </label>
                                </div>
                            </li>
                            <?php 
                                endforeach;
                            else:
                                echo '<p style="padding: 20px; color: #666;">タグがありません</p>';
                            endif;
                            ?>
                        </ul>
                    </div>
                </div>
                
                <!-- 投稿者サブタブ -->
                <div id="subtab-users" class="sub-panel" style="display: none;">
                    <div class="panel-header">
                        <h2>👤 投稿者アーカイブ</h2>
                    </div>
                    <div class="tree-container">
                        <div class=" notice-info" style="margin: 0 0 20px 0;">
                            <p>🔒 セキュリティのため、投稿者アーカイブはデフォルトでnoindex設定になっています。<br>
                            必要な場合のみ個別にインデックスを有効にしてください。</p>
                        </div>
                        <ul class="tree-list level-0">
                            <?php
                            $users = get_users(['has_published_posts' => true]);
                            if ( $users ) :
                                foreach ( $users as $user ) :
                                    $is_noindex = lw_get_noindex_status( 'author', $user->ID );
                                    $post_count = count_user_posts( $user->ID, 'post', true );
                            ?>
                            <li class="tree-item">
                                <div class="item-content">
                                    <span class="tree-indent"></span>
                                    <a href="<?php echo get_author_posts_url( $user->ID ); ?>" target="_blank" class="item-title">
                                        👤 <?php echo esc_html( $user->display_name ); ?> 
                                        <small>(投稿数: <?php echo $post_count; ?>)</small>
                                    </a>
                                    <label class="toggle-switch">
                                        <input type="checkbox" class="noindex-toggle" 
                                            data-type="author" data-id="<?php echo $user->ID; ?>" 
                                            <?php checked( ! $is_noindex, true ); ?>>
                                        <span class="toggle-slider"></span>
                                        <span class="toggle-label"><?php echo $is_noindex ? 'noindex' : 'index'; ?></span>
                                    </label>
                                </div>
                            </li>
                            <?php 
                                endforeach;
                            else:
                                echo '<p style="padding: 20px; color: #666;">投稿者がいません</p>';
                            endif;
                            ?>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 基本設定タブ -->
        <div id="tab-basic-settings" class="tab-panel">
            <form method="post" action="">
                <?php wp_nonce_field( 'lw_sitemap_settings', 'lw_sitemap_settings_nonce' ); ?>
                
                <div class="settings-section">
                    <h3>更新頻度設定（changefreq）</h3>
                    <p class="description">検索エンジンに対して、各ページの更新頻度の目安を通知します。</p>
                    
                    <table class="form-table">
                        <tr>
                            <th>トップページ</th>
                            <td>
                                <select name="changefreq[homepage]">
                                    <option value="always" <?php selected( $settings['changefreq']['homepage'], 'always' ); ?>>常時</option>
                                    <option value="hourly" <?php selected( $settings['changefreq']['homepage'], 'hourly' ); ?>>毎時</option>
                                    <option value="daily" <?php selected( $settings['changefreq']['homepage'], 'daily' ); ?>>毎日</option>
                                    <option value="weekly" <?php selected( $settings['changefreq']['homepage'], 'weekly' ); ?>>毎週</option>
                                    <option value="monthly" <?php selected( $settings['changefreq']['homepage'], 'monthly' ); ?>>毎月</option>
                                    <option value="yearly" <?php selected( $settings['changefreq']['homepage'], 'yearly' ); ?>>毎年</option>
                                    <option value="never" <?php selected( $settings['changefreq']['homepage'], 'never' ); ?>>更新なし</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>投稿</th>
                            <td>
                                <select name="changefreq[post]">
                                    <option value="always" <?php selected( $settings['changefreq']['post'], 'always' ); ?>>常時</option>
                                    <option value="hourly" <?php selected( $settings['changefreq']['post'], 'hourly' ); ?>>毎時</option>
                                    <option value="daily" <?php selected( $settings['changefreq']['post'], 'daily' ); ?>>毎日</option>
                                    <option value="weekly" <?php selected( $settings['changefreq']['post'], 'weekly' ); ?>>毎週</option>
                                    <option value="monthly" <?php selected( $settings['changefreq']['post'], 'monthly' ); ?>>毎月</option>
                                    <option value="yearly" <?php selected( $settings['changefreq']['post'], 'yearly' ); ?>>毎年</option>
                                    <option value="never" <?php selected( $settings['changefreq']['post'], 'never' ); ?>>更新なし</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>固定ページ</th>
                            <td>
                                <select name="changefreq[page]">
                                    <option value="always" <?php selected( $settings['changefreq']['page'], 'always' ); ?>>常時</option>
                                    <option value="hourly" <?php selected( $settings['changefreq']['page'], 'hourly' ); ?>>毎時</option>
                                    <option value="daily" <?php selected( $settings['changefreq']['page'], 'daily' ); ?>>毎日</option>
                                    <option value="weekly" <?php selected( $settings['changefreq']['page'], 'weekly' ); ?>>毎週</option>
                                    <option value="monthly" <?php selected( $settings['changefreq']['page'], 'monthly' ); ?>>毎月</option>
                                    <option value="yearly" <?php selected( $settings['changefreq']['page'], 'yearly' ); ?>>毎年</option>
                                    <option value="never" <?php selected( $settings['changefreq']['page'], 'never' ); ?>>更新なし</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>カテゴリー</th>
                            <td>
                                <select name="changefreq[category]">
                                    <option value="always" <?php selected( $settings['changefreq']['category'], 'always' ); ?>>常時</option>
                                    <option value="hourly" <?php selected( $settings['changefreq']['category'], 'hourly' ); ?>>毎時</option>
                                    <option value="daily" <?php selected( $settings['changefreq']['category'], 'daily' ); ?>>毎日</option>
                                    <option value="weekly" <?php selected( $settings['changefreq']['category'], 'weekly' ); ?>>毎週</option>
                                    <option value="monthly" <?php selected( $settings['changefreq']['category'], 'monthly' ); ?>>毎月</option>
                                    <option value="yearly" <?php selected( $settings['changefreq']['category'], 'yearly' ); ?>>毎年</option>
                                    <option value="never" <?php selected( $settings['changefreq']['category'], 'never' ); ?>>更新なし</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>タグ</th>
                            <td>
                                <select name="changefreq[post_tag]">
                                    <option value="always" <?php selected( $settings['changefreq']['post_tag'], 'always' ); ?>>常時</option>
                                    <option value="hourly" <?php selected( $settings['changefreq']['post_tag'], 'hourly' ); ?>>毎時</option>
                                    <option value="daily" <?php selected( $settings['changefreq']['post_tag'], 'daily' ); ?>>毎日</option>
                                    <option value="weekly" <?php selected( $settings['changefreq']['post_tag'], 'weekly' ); ?>>毎週</option>
                                    <option value="monthly" <?php selected( $settings['changefreq']['post_tag'], 'monthly' ); ?>>毎月</option>
                                    <option value="yearly" <?php selected( $settings['changefreq']['post_tag'], 'yearly' ); ?>>毎年</option>
                                    <option value="never" <?php selected( $settings['changefreq']['post_tag'], 'never' ); ?>>更新なし</option>
                                </select>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="settings-section">
                    <h3>優先度設定（priority）</h3>
                    <p class="description">0.0〜1.0の値で、サイト内での相対的な重要度を設定します。</p>
                    
                    <table class="form-table">
                        <tr>
                            <th>トップページ</th>
                            <td>
                                <input type="number" name="priority[homepage]" value="<?php echo esc_attr( $settings['priority']['homepage'] ); ?>" min="0" max="1" step="0.1" />
                            </td>
                        </tr>
                        <tr>
                            <th>投稿</th>
                            <td>
                                <input type="number" name="priority[post]" value="<?php echo esc_attr( $settings['priority']['post'] ); ?>" min="0" max="1" step="0.1" />
                            </td>
                        </tr>
                        <tr>
                            <th>固定ページ</th>
                            <td>
                                <input type="number" name="priority[page]" value="<?php echo esc_attr( $settings['priority']['page'] ); ?>" min="0" max="1" step="0.1" />
                            </td>
                        </tr>
                        <tr>
                            <th>カテゴリー</th>
                            <td>
                                <input type="number" name="priority[category]" value="<?php echo esc_attr( $settings['priority']['category'] ); ?>" min="0" max="1" step="0.1" />
                            </td>
                        </tr>
                        <tr>
                            <th>タグ</th>
                            <td>
                                <input type="number" name="priority[post_tag]" value="<?php echo esc_attr( $settings['priority']['post_tag'] ); ?>" min="0" max="1" step="0.1" />
                            </td>
                        </tr>
                        <tr>
                            <th>投稿者</th>
                            <td>
                                <input type="number" name="priority[author]" value="<?php echo esc_attr( $settings['priority']['author'] ); ?>" min="0" max="1" step="0.1" />
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="settings-section">
                    <h3>画像サイトマップ設定</h3>
                    <p class="description">投稿内の画像をサイトマップに含める設定です。</p>
                    
                    <table class="form-table">
                        <tr>
                            <th>画像を含める</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="images[include_images]" value="1" <?php checked( $settings['images']['include_images'], true ); ?> />
                                    投稿内の画像をサイトマップに含める
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>アイキャッチ画像</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="images[include_featured]" value="1" <?php checked( $settings['images']['include_featured'], true ); ?> />
                                    アイキャッチ画像を含める
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>キャプション</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="images[include_captions]" value="1" <?php checked( $settings['images']['include_captions'], true ); ?> />
                                    画像のキャプションを含める
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <p class="submit">
                    <input type="submit" class="button-primary" value="設定を保存" />
                </p>
            </form>
        </div>
        
        <!-- 高度な設定タブ -->
        <div id="tab-advanced-settings" class="tab-panel">
            <form method="post" action="">
                <?php wp_nonce_field( 'lw_sitemap_settings', 'lw_sitemap_settings_nonce' ); ?>
                
                <div class="settings-section">
                    <h3>除外設定</h3>
                    <p class="description">サイトマップから除外する項目の設定です。</p>
                    
                    <table class="form-table">
                        <tr>
                            <th>投稿フォーマット</th>
                            <td>
                                <?php
                                $post_formats = get_theme_support( 'post-formats' );
                                if ( $post_formats && is_array( $post_formats[0] ) ) :
                                    foreach ( $post_formats[0] as $format ) :
                                ?>
                                <label style="display: block; margin-bottom: 5px;">
                                    <input type="checkbox" name="exclude[post_formats][]" value="<?php echo $format; ?>" 
                                        <?php checked( in_array( $format, $settings['exclude']['post_formats'] ?? [] ) ); ?> />
                                    <?php echo ucfirst( $format ); ?>
                                </label>
                                <?php 
                                    endforeach;
                                else:
                                    echo '<p style="color: #666;">投稿フォーマットが設定されていません</p>';
                                endif;
                                ?>
                            </td>
                        </tr>
                        <tr>
                            <th>カスタム投稿タイプ</th>
                            <td>
                                <?php
                                $custom_post_types = get_post_types( ['public' => true, '_builtin' => false] );
                                if ( $custom_post_types ) :
                                    foreach ( $custom_post_types as $cpt ) :
                                        $cpt_obj = get_post_type_object( $cpt );
                                ?>
                                <label style="display: block; margin-bottom: 5px;">
                                    <input type="checkbox" name="exclude[post_types][]" value="<?php echo $cpt; ?>" 
                                        <?php checked( in_array( $cpt, $settings['exclude']['post_types'] ?? [] ) ); ?> />
                                    <?php echo $cpt_obj->labels->name; ?>
                                </label>
                                <?php 
                                    endforeach;
                                else:
                                    echo '<p style="color: #666;">カスタム投稿タイプがありません</p>';
                                endif;
                                ?>
                            </td>
                        </tr>
                        <tr>
                            <th>その他の除外</th>
                            <td>
                                <label style="display: block; margin-bottom: 5px;">
                                    <input type="checkbox" name="exclude[exclude_media]" value="1" 
                                        <?php checked( $settings['exclude']['exclude_media'] ?? false, true ); ?> />
                                    メディア（添付ファイル）を除外
                                </label>
                                <label style="display: block; margin-bottom: 5px;">
                                    <input type="checkbox" name="exclude[exclude_password]" value="1" 
                                        <?php checked( $settings['exclude']['exclude_password'] ?? false, true ); ?> />
                                    パスワード保護されたページを除外
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="settings-section">
                    <h3>自動通知設定</h3>
                    <p class="description">検索エンジンへの自動通知設定です。</p>
                    
                    <table class="form-table">
                        <tr>
                            <th>Google通知</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="ping[google_ping]" value="1" <?php checked( $settings['ping']['google_ping'], true ); ?> />
                                    Googleに自動でPing送信する
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>Bing通知</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="ping[bing_ping]" value="1" <?php checked( $settings['ping']['bing_ping'], true ); ?> />
                                    Bingに自動でPing送信する
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>自動Ping</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="ping[auto_ping]" value="1" <?php checked( $settings['ping']['auto_ping'], true ); ?> />
                                    サイトマップ更新時に自動でPing送信
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>投稿公開時</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="ping[ping_on_publish]" value="1" <?php checked( $settings['ping']['ping_on_publish'], true ); ?> />
                                    新規投稿公開時にPing送信
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="settings-section">
                    <h3>キャッシュ設定</h3>
                    <p class="description">パフォーマンス向上のためのキャッシュ設定です。</p>
                    
                    <table class="form-table">
                        <tr>
                            <th>キャッシュ有効化</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="cache[enable_cache]" value="1" <?php checked( $settings['cache']['enable_cache'], true ); ?> />
                                    サイトマップのキャッシュを有効にする
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>キャッシュ有効期限</th>
                            <td>
                                <select name="cache[cache_lifetime]">
                                    <option value="3600" <?php selected( $settings['cache']['cache_lifetime'], 3600 ); ?>>1時間</option>
                                    <option value="21600" <?php selected( $settings['cache']['cache_lifetime'], 21600 ); ?>>6時間</option>
                                    <option value="43200" <?php selected( $settings['cache']['cache_lifetime'], 43200 ); ?>>12時間</option>
                                    <option value="86400" <?php selected( $settings['cache']['cache_lifetime'], 86400 ); ?>>24時間</option>
                                    <option value="604800" <?php selected( $settings['cache']['cache_lifetime'], 604800 ); ?>>1週間</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>自動再生成</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="cache[auto_regenerate]" value="1" <?php checked( $settings['cache']['auto_regenerate'], true ); ?> />
                                    コンテンツ更新時に自動でキャッシュを再生成
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="settings-section">
                    <h3>その他の設定</h3>
                    
                    <table class="form-table">
                        <tr>
                            <th>robots.txt</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="advanced[add_to_robots]" value="1" <?php checked( $settings['advanced']['add_to_robots'], true ); ?> />
                                    robots.txtにサイトマップURLを自動追加
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>XSLスタイルシート</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="advanced[enable_xsl]" value="1" <?php checked( $settings['advanced']['enable_xsl'], true ); ?> />
                                    ブラウザで見やすいXSLスタイルシートを使用
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>最終更新日</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="advanced[include_lastmod]" value="1" <?php checked( $settings['advanced']['include_lastmod'], true ); ?> />
                                    各URLの最終更新日時を含める
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <p class="submit">
                    <input type="submit" class="button-primary" value="設定を保存" />
                </p>
            </form>
        </div>
         <!-- llms.txt設定タブ（修正版） -->
        <div id="tab-llms-settings" class="tab-panel" style="display: none;">
            <div class="settings-section">
                <h3>🤖 AI/LLMクローラー設定</h3>
                <p class="description">AI/LLMクローラーに対するアクセス制御を設定します。</p>
                
                <form method="post" action="">
                    <?php wp_nonce_field('lw_llms_settings', 'lw_llms_settings_nonce'); ?>
                    
                    <table class="form-table">
                        <tr>
                            <th>llms.txt有効化</th>
                            <td>
                                <label>
                                    <input type="checkbox" id="enable_llms_txt" name="llms[enable_llms_txt]" value="1" 
                                        <?php checked($settings['llms']['enable_llms_txt'] ?? true, true); ?>>
                                    llms.txtファイルを有効にする
                                </label>
                            </td>
                        </tr>
                        
                        <tr>
                            <th>AIクローリング許可</th>
                            <td>
                                <label>
                                    <input type="checkbox" id="allow_ai_crawling" name="llms[allow_ai_crawling]" value="1" 
                                        <?php checked($settings['llms']['allow_ai_crawling'] ?? true, true); ?>>
                                    AI/LLMによるコンテンツのクローリングを許可する
                                </label>
                            </td>
                        </tr>
                        
                        <tr>
                            <th>許可するAIボット</th>
                            <td>
                                <div class="ai-agents-section">
                                    <?php
                                    $ai_agents = [
                                        'GPTBot' => 'OpenAI GPT',
                                        'ChatGPT-User' => 'ChatGPT Web',
                                        'CCBot' => 'Common Crawl',
                                        'anthropic-ai' => 'Anthropic AI',
                                        'Claude-Web' => 'Claude',
                                        'Bingbot' => 'Microsoft Bing',
                                        'Googlebot' => 'Google',
                                    ];
                                    foreach ($ai_agents as $agent => $label) :
                                    ?>
                                    <label style="display: block; margin-bottom: 8px;">
                                        <input type="checkbox" class="ai-agent-checkbox" 
                                            name="llms[allowed_agents][<?php echo $agent; ?>]" 
                                            data-agent="<?php echo $agent; ?>"
                                            value="1"
                                            <?php checked($settings['llms']['allowed_agents'][$agent] ?? false, true); ?>>
                                        <?php echo $label; ?> (<?php echo $agent; ?>)
                                    </label>
                                    <?php endforeach; ?>
                                    
                                    <div style="margin-top: 10px;">
                                        <a href="#" id="select_all_agents">すべて選択</a> | 
                                        <a href="#" id="deselect_all_agents">すべて解除</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                        <tr>
                            <th>除外するパス</th>
                            <td>
                                <textarea id="disallowed_paths" name="llms[disallowed_paths]" rows="5" style="width: 100%;"><?php 
                                    echo implode("\n", $settings['llms']['disallowed_paths'] ?? ['/wp-admin/', '/wp-includes/']);
                                ?></textarea>
                                <p class="description">除外するパスを1行に1つずつ入力してください。</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <th>クロール遅延（秒）</th>
                            <td>
                                <input type="number" id="crawl_delay" name="llms[crawl_delay]" 
                                    value="<?php echo esc_attr($settings['llms']['crawl_delay'] ?? 1); ?>" 
                                    min="0" max="10" step="1">
                                <p class="description">クロール間隔を秒単位で指定します（0で無制限）。</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <th>サイトマップ参照</th>
                            <td>
                                <label>
                                    <input type="checkbox" id="sitemap_reference" name="llms[sitemap_reference]" value="1"
                                        <?php checked($settings['llms']['sitemap_reference'] ?? true, true); ?>>
                                    llms.txtにサイトマップURLを含める
                                </label>
                            </td>
                        </tr>
                        
                        <tr>
                            <th>カスタムルール</th>
                            <td>
                                <textarea id="custom_rules" name="llms[custom_rules]" rows="5" style="width: 100%;"><?php 
                                    echo esc_textarea($settings['llms']['custom_rules'] ?? '');
                                ?></textarea>
                                <p class="description">追加のカスタムルールを記述できます。</p>
                            </td>
                        </tr>
                    </table>
                    
                    <p class="submit">
                        <input type="submit" name="save_llms_settings" class="button-primary" value="llms.txt設定を保存">
                        <input type="submit" name="generate_llms_txt" class="button-secondary" value="llms.txtを生成">
                    </p>
                </form>
            </div>
            
            <!-- llms.txtプレビューセクション -->
            <div class="settings-section">
                <h3>📝 llms.txt プレビュー</h3>
                <p>現在のllms.txtの内容です。</p>
                <textarea id="llms-preview-content" readonly style="width: 100%; height: 300px; font-family: monospace;">
    <?php 
    $llms_file = ABSPATH . 'llms.txt';
    if (file_exists($llms_file)) {
        echo esc_textarea(file_get_contents($llms_file));
    } else {
        echo "# llms.txt がまだ生成されていません。\n";
        echo "# 上記の設定を保存して「llms.txtを生成」ボタンをクリックしてください。";
    }
    ?>
                </textarea>
                
                <?php if (file_exists($llms_file)) : ?>
                <div id="llms-file-status" style="margin-top: 15px;">
                    <a href="<?php echo home_url('/llms.txt'); ?>" target="_blank" class="button">
                        llms.txtを表示
                    </a>
                    <span style="margin-left: 10px; color: #666;">
                        最終更新: <?php echo date('Y/m/d H:i', filemtime($llms_file)); ?>
                    </span>
                </div>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- ツールタブ（修正版：llms.txt関連を削除） -->
        <div id="tab-tools" class="tab-panel" style="display: none;">
            <div class="tools-section">
                <h3>🔄 キャッシュ管理</h3>
                <p>サイトマップのキャッシュをクリアして、最新の情報で再生成します。</p>
                <form method="post" action="" style="display: inline-block;">
                    <?php wp_nonce_field( 'clear_cache', 'cache_nonce' ); ?>
                    <input type="submit" name="clear_cache" class="button button-secondary" value="キャッシュをクリア" />
                </form>
            </div>
            
            <div class="tools-section">
                <h3>📡 手動Ping送信</h3>
                <p>Google・Bingに手動でサイトマップの更新を通知します。</p>
                <form method="post" action="" style="display: inline-block;">
                    <?php wp_nonce_field( 'send_ping', 'ping_nonce' ); ?>
                    <input type="submit" name="send_ping" class="button button-secondary" value="今すぐPing送信" />
                </form>
            </div>
            
            <div class="tools-section">
                <h3>📊 サイトマップ統計</h3>
                <div class="sitemap-info">
                    <table class="widefat">
                        <thead>
                            <tr>
                                <th>項目</th>
                                <th>件数</th>
                                <th>サイトマップURL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>投稿</td>
                                <td><?php echo wp_count_posts()->publish; ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-posts-post-1.xml'); ?>" target="_blank">/wp-sitemap-posts-post-1.xml</a></td>
                            </tr>
                            <tr>
                                <td>固定ページ</td>
                                <td><?php echo wp_count_posts('page')->publish; ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-posts-page-1.xml'); ?>" target="_blank">/wp-sitemap-posts-page-1.xml</a></td>
                            </tr>
                            <tr>
                                <td>カテゴリー</td>
                                <td><?php echo wp_count_terms('category'); ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-taxonomies-category-1.xml'); ?>" target="_blank">/wp-sitemap-taxonomies-category-1.xml</a></td>
                            </tr>
                            <tr>
                                <td>タグ</td>
                                <td><?php echo wp_count_terms('post_tag'); ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-taxonomies-post_tag-1.xml'); ?>" target="_blank">/wp-sitemap-taxonomies-post_tag-1.xml</a></td>
                            </tr>
                            <tr>
                                <td>投稿者（インデックス済み）</td>
                                <td><?php echo get_indexed_users_count(); ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-users-1.xml'); ?>" target="_blank">/wp-sitemap-users-1.xml</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="tools-section">
                <h3>📝 robots.txt プレビュー</h3>
                <p>現在のrobots.txtの内容です。サイトマップURLが含まれているか確認してください。</p>
                <textarea readonly style="width: 100%; height: 200px; font-family: monospace;">
                <?php 
                $robots_content = '';
                $robots_file = ABSPATH . 'robots.txt';
                if ( file_exists( $robots_file ) ) {
                    $robots_content = file_get_contents( $robots_file );
                } else {
                    $robots_content = "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\nSitemap: " . home_url('/wp-sitemap.xml');
                }
                echo esc_textarea( $robots_content );
                ?>
                </textarea>
            </div>
        </div>
        <!-- ツールタブ -->
        <div id="tab-tools" class="tab-panel">
            <div class="tools-section">
                <h3>🔄 キャッシュ管理</h3>
                <p>サイトマップのキャッシュをクリアして、最新の情報で再生成します。</p>
                <form method="post" action="" style="display: inline-block;">
                    <?php wp_nonce_field( 'clear_cache', 'cache_nonce' ); ?>
                    <input type="submit" name="clear_cache" class="button button-secondary" value="キャッシュをクリア" />
                </form>
            </div>
            
            <div class="tools-section">
                <h3>📡 手動Ping送信</h3>
                <p>Google・Bingに手動でサイトマップの更新を通知します。</p>
                <form method="post" action="" style="display: inline-block;">
                    <?php wp_nonce_field( 'send_ping', 'ping_nonce' ); ?>
                    <input type="submit" name="send_ping" class="button button-secondary" value="今すぐPing送信" />
                </form>
            </div>
            
            <div class="tools-section">
                <h3>📊 サイトマップ統計</h3>
                <div class="sitemap-info">
                    <table class="widefat">
                        <thead>
                            <tr>
                                <th>項目</th>
                                <th>件数</th>
                                <th>サイトマップURL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>投稿</td>
                                <td><?php echo wp_count_posts()->publish; ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-posts-post-1.xml'); ?>" target="_blank">/wp-sitemap-posts-post-1.xml</a></td>
                            </tr>
                            <tr>
                                <td>固定ページ</td>
                                <td><?php echo wp_count_posts('page')->publish; ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-posts-page-1.xml'); ?>" target="_blank">/wp-sitemap-posts-page-1.xml</a></td>
                            </tr>
                            <tr>
                                <td>カテゴリー</td>
                                <td><?php echo wp_count_terms('category'); ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-taxonomies-category-1.xml'); ?>" target="_blank">/wp-sitemap-taxonomies-category-1.xml</a></td>
                            </tr>
                            <tr>
                                <td>タグ</td>
                                <td><?php echo wp_count_terms('post_tag'); ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-taxonomies-post_tag-1.xml'); ?>" target="_blank">/wp-sitemap-taxonomies-post_tag-1.xml</a></td>
                            </tr>
                            <tr>
                                <td>投稿者（インデックス済み）</td>
                                <td><?php echo get_indexed_users_count(); ?></td>
                                <td><a href="<?php echo home_url('/wp-sitemap-users-1.xml'); ?>" target="_blank">/wp-sitemap-users-1.xml</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="tools-section">
                <h3>📝 robots.txt プレビュー</h3>
                <p>現在のrobots.txtの内容です。サイトマップURLが含まれているか確認してください。</p>
                <textarea readonly style="width: 100%; height: 200px; font-family: monospace;">
<?php 
$robots_content = '';
$robots_file = ABSPATH . 'robots.txt';
if ( file_exists( $robots_file ) ) {
    $robots_content = file_get_contents( $robots_file );
} else {
    $robots_content = "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\nSitemap: " . home_url('/wp-sitemap.xml');
}
echo esc_textarea( $robots_content );
?>
                </textarea>
            </div>
        </div>
        
    </div>

    <!-- 保存インジケーター -->
    <div class="save-indicator" id="save-indicator">
        <span class="saving">保存中...</span>
        <span class="saved">✓ 保存しました</span>
        <span class="error">エラーが発生しました</span>
    </div>
</div>

<script>
jQuery(document).ready(function($) {
    // Ajax設定
    const ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';
    const nonce = '<?php echo wp_create_nonce('lw_sitemap_control'); ?>';
    
    // メインタブ切り替え
    $('.main-tabs .tab-button').on('click', function() {
        const tabId = $(this).data('tab');
        
        $('.main-tabs .tab-button').removeClass('active');
        $(this).addClass('active');
        
        $('.sitemap-content > .tab-panel').removeClass('active').hide();
        $('#tab-' + tabId).addClass('active').show();
        
        // 各タブごとの初期化処理
        if (tabId === 'index-control') {
            updateStats();
        } else if (tabId === 'llms-settings') {
            updateLlmsPreview();
        }
    });
    
    // サブタブ切り替え
    $('.sub-tab').on('click', function(e) {
        e.preventDefault();
        const tabId = $(this).data('tab');
        
        $('.sub-tab').removeClass('active');
        $(this).addClass('active');
        
        $('.sub-panel').hide();
        $('#subtab-' + tabId).show();
    });
    
    // llms.txt設定のリアルタイムプレビュー
    function updateLlmsPreview() {
        const settings = collectLlmsSettings();
        
        $.ajax({
            url: ajaxUrl,
            method: 'POST',
            data: {
                action: 'lw_preview_llms_txt',
                nonce: nonce,
                settings: settings
            },
            success: function(response) {
                if (response.success) {
                    $('#llms-preview-content').val(response.data.content);
                }
            }
        });
    }
    
    // llms.txt設定を収集
    function collectLlmsSettings() {
        const settings = {
            enable_llms_txt: $('#enable_llms_txt').is(':checked'),
            allow_ai_crawling: $('#allow_ai_crawling').is(':checked'),
            allowed_agents: {},
            disallowed_paths: $('#disallowed_paths').val().split('\n').filter(Boolean),
            crawl_delay: $('#crawl_delay').val(),
            custom_rules: $('#custom_rules').val(),
            sitemap_reference: $('#sitemap_reference').is(':checked')
        };
        
        // 許可するエージェントを収集
        $('.ai-agent-checkbox').each(function() {
            const agent = $(this).data('agent');
            settings.allowed_agents[agent] = $(this).is(':checked');
        });
        
        return settings;
    }
    
    // llms.txt設定変更時のリアルタイムプレビュー
    $(document).on('change', '#tab-llms-settings input, #tab-llms-settings textarea', function() {
        // デバウンス処理
        clearTimeout(window.llmsPreviewTimer);
        window.llmsPreviewTimer = setTimeout(function() {
            updateLlmsPreview();
        }, 500);
    });
    
    // AIクローリング許可のトグル処理
    $('#allow_ai_crawling').on('change', function() {
        const isAllowed = $(this).is(':checked');
        $('.ai-agents-section').toggle(isAllowed);
        if (!isAllowed) {
            $('.ai-agent-checkbox').prop('checked', false);
        }
    });
    
    // 全AIエージェント選択/解除
    $('#select_all_agents').on('click', function(e) {
        e.preventDefault();
        $('.ai-agent-checkbox').prop('checked', true);
        updateLlmsPreview();
    });
    
    $('#deselect_all_agents').on('click', function(e) {
        e.preventDefault();
        $('.ai-agent-checkbox').prop('checked', false);
        updateLlmsPreview();
    });
    
    // llms.txt生成ボタン
    $('#generate_llms_button').on('click', function(e) {
        e.preventDefault();
        
        const $button = $(this);
        $button.prop('disabled', true).text('生成中...');
        
        $.ajax({
            url: ajaxUrl,
            method: 'POST',
            data: {
                action: 'lw_generate_llms_txt',
                nonce: nonce,
                settings: collectLlmsSettings()
            },
            success: function(response) {
                if (response.success) {
                    showNotification('success', 'llms.txtを生成しました');
                    $('#llms-file-status').html(response.data.status);
                } else {
                    showNotification('error', response.data.message || 'llms.txtの生成に失敗しました');
                }
            },
            error: function() {
                showNotification('error', 'エラーが発生しました');
            },
            complete: function() {
                $button.prop('disabled', false).text('llms.txtを生成');
            }
        });
    });
    
    // 既存のツリー展開/折りたたみ機能
    $(document).on('click', '.tree-toggle', function(e) {
        e.preventDefault();
        const $item = $(this).closest('.tree-item');
        const isExpanded = $(this).attr('aria-expanded') === 'true';
        
        if (isExpanded) {
            $item.addClass('collapsed');
            $(this).attr('aria-expanded', 'false').text('▶');
        } else {
            $item.removeClass('collapsed');
            $(this).attr('aria-expanded', 'true').text('▼');
        }
    });
    
    // 通知表示関数
    function showNotification(type, message) {
        const $notification = $('<div>')
            .addClass('notice notice-' + type + ' is-dismissible')
            .html('<p>' + message + '</p>')
            .prependTo('.wrap');
        
        // 自動で消える
        setTimeout(function() {
            $notification.fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }
    
    // 保存インジケーター改善
    function showSaveIndicator(status) {
        const $indicator = $('#save-indicator');
        $indicator.removeClass('saving saved error').addClass('show ' + status);
        
        if (status !== 'saving') {
            setTimeout(function() {
                $indicator.removeClass('show');
            }, 2000);
        }
    }
    
    // noindexトグル保存処理（既存コードの改善）
    $(document).on('change', '.noindex-toggle', function() {
        const $toggle = $(this);
        const $label = $toggle.siblings('.toggle-label');
        const isIndexed = $toggle.prop('checked');
        const type = $toggle.data('type');
        const id = $toggle.data('id');
        
        $label.text(isIndexed ? 'index' : 'noindex');
        updateStats();
        showSaveIndicator('saving');
        
        $.ajax({
            url: ajaxUrl,
            method: 'POST',
            data: {
                action: 'lw_save_noindex',
                nonce: nonce,
                type: type,
                id: id,
                noindex: !isIndexed
            },
            success: function(response) {
                if (response.success) {
                    showSaveIndicator('saved');
                } else {
                    $toggle.prop('checked', !isIndexed);
                    $label.text(!isIndexed ? 'index' : 'noindex');
                    updateStats();
                    showSaveIndicator('error');
                }
            },
            error: function() {
                $toggle.prop('checked', !isIndexed);
                $label.text(!isIndexed ? 'index' : 'noindex');
                updateStats();
                showSaveIndicator('error');
            }
        });
    });
    
    // 統計更新関数
    function updateStats() {
        const total = $('.noindex-toggle').length;
        const indexed = $('.noindex-toggle:checked').length;
        const noindex = total - indexed;
        
        $('#total-pages').text(total);
        $('#indexed-pages').text(indexed);
        $('#noindex-pages').text(noindex);
    }
    
    // タブのURL履歴管理（ブラウザバック対応）
    function updateTabUrl(tabId) {
        const url = new URL(window.location);
        url.searchParams.set('tab', tabId);
        window.history.pushState({tab: tabId}, '', url);
    }
    
    // URLパラメータからタブを復元
    function restoreTabFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const tabId = urlParams.get('tab');
        
        if (tabId) {
            $('.main-tabs .tab-button[data-tab="' + tabId + '"]').trigger('click');
        }
    }
    
    // ブラウザバック時の処理
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.tab) {
            $('.main-tabs .tab-button[data-tab="' + e.state.tab + '"]').trigger('click');
        }
    });
    
    // キーボードショートカット
    $(document).on('keydown', function(e) {
        // Ctrl+S or Cmd+S で設定を保存
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            $('.tab-panel.active form').submit();
        }
    });
    
    // 初期化
    updateStats();
    restoreTabFromUrl();
    
    // llms.txt設定の初期状態
    if ($('#allow_ai_crawling').length) {
        $('.ai-agents-section').toggle($('#allow_ai_crawling').is(':checked'));
    }
});
</script>