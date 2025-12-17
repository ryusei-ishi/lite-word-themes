<?php
/**
 * LiteWord Cache Manager
 * 全ページ静的キャッシュシステム
 */

class LW_Cache_Manager {
    
    private $cache_dir;
    
    public function __construct() {
        $this->cache_dir = WP_CONTENT_DIR . '/cache';
        
        add_action('admin_menu', array($this, 'lw_cache_add_admin_menu'));
        add_action('admin_post_lw_cache_generate_all', array($this, 'lw_cache_generate_all_pages'));
        add_action('admin_post_lw_cache_clear_all', array($this, 'lw_cache_clear_all'));
        add_action('save_post', array($this, 'lw_cache_clear_on_update'), 10, 2);
        add_action('delete_post', array($this, 'lw_cache_clear_on_update'), 10, 2);
    }
    
    public function lw_cache_add_admin_menu() {
        add_menu_page(
            'LiteWord キャッシュ',
            'LW キャッシュ',
            'manage_options',
            'lw-cache',
            array($this, 'lw_cache_admin_page'),
            'dashicons-performance',
            80
        );
    }
    
    public function lw_cache_admin_page() {
        $cache_count = $this->lw_cache_count_files();
        $cache_size = $this->lw_cache_get_size();
        
        ?>
        <div class="wrap">
            <h1>LiteWord 静的キャッシュ管理</h1>
            
            <div class="card">
                <h2>キャッシュ統計</h2>
                <p>キャッシュファイル数: <strong><?php echo esc_html($cache_count); ?></strong> ファイル</p>
                <p>キャッシュサイズ: <strong><?php echo esc_html($cache_size); ?></strong></p>
            </div>
            
            <div class="card">
                <h2>キャッシュ操作</h2>
                
                <form method="post" action="<?php echo admin_url('admin-post.php'); ?>" style="display: inline-block; margin-right: 10px;">
                    <?php wp_nonce_field('lw_cache_generate_all'); ?>
                    <input type="hidden" name="action" value="lw_cache_generate_all">
                    <button type="submit" class="button button-primary button-large">
                        全ページキャッシュ生成
                    </button>
                </form>
                
                <form method="post" action="<?php echo admin_url('admin-post.php'); ?>" style="display: inline-block;" onsubmit="return confirm('全てのキャッシュを削除しますか?');">
                    <?php wp_nonce_field('lw_cache_clear_all'); ?>
                    <input type="hidden" name="action" value="lw_cache_clear_all">
                    <button type="submit" class="button button-large">
                        全キャッシュクリア
                    </button>
                </form>
            </div>
            
            <div class="card">
                <h2>セットアップ状況</h2>
                <ul>
                    <li><?php echo file_exists(WP_CONTENT_DIR . '/advanced-cache.php') ? '✅' : '❌'; ?> advanced-cache.php</li>
                    <li><?php echo defined('WP_CACHE') && WP_CACHE ? '✅' : '❌'; ?> WP_CACHE設定</li>
                    <li><?php echo file_exists($this->cache_dir) ? '✅' : '❌'; ?> cacheディレクトリ</li>
                </ul>
                <?php if (!defined('WP_CACHE') || !WP_CACHE): ?>
                <p style="color: red;">
                    <strong>重要:</strong> wp-config.php に以下を追加してください:<br>
                    <code>define('WP_CACHE', true);</code>
                </p>
                <?php endif; ?>
            </div>
            
            <div class="card">
                <h2>使い方</h2>
                <ol>
                    <li><strong>「全ページキャッシュ生成」</strong>をクリック</li>
                    <li>キャッシュ生成完了！</li>
                    <li>ページを更新すると自動的にキャッシュがクリアされます</li>
                </ol>
            </div>
        </div>
        
        <style>
            .card {
                background: #fff;
                border: 1px solid #ccd0d4;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 1px 1px rgba(0,0,0,.04);
            }
            .card h2 {
                margin-top: 0;
            }
        </style>
        <?php
    }
    
    public function lw_cache_generate_all_pages() {
        if (!current_user_can('manage_options')) {
            wp_die('権限がありません');
        }
        
        check_admin_referer('lw_cache_generate_all');
        
        $this->lw_cache_create_cache_dir();
        
        $urls = $this->lw_cache_get_all_urls();
        
        $success_count = 0;
        $error_count = 0;
        
        foreach ($urls as $url) {
            if ($this->lw_cache_generate_single_page($url)) {
                $success_count++;
            } else {
                $error_count++;
            }
        }
        
        wp_redirect(add_query_arg(
            array(
                'page' => 'lw-cache',
                'success' => $success_count,
                'error' => $error_count,
                'message' => 'generated'
            ),
            admin_url('admin.php')
        ));
        exit;
    }
    
    private function lw_cache_get_all_urls() {
        $urls = array();

        $urls[] = home_url('/');

        // ページ数制限を撤廃し、全ページを取得（バッチ処理）
        $page_number = 1;
        $batch_size = 500;

        while (true) {
            $pages = get_pages(array(
                'post_status' => 'publish',
                'number' => $batch_size,
                'offset' => ($page_number - 1) * $batch_size,
                'sort_column' => 'post_date',
                'sort_order' => 'DESC'
            ));

            if (empty($pages)) {
                break;
            }

            foreach ($pages as $page) {
                $urls[] = get_permalink($page->ID);
            }

            // バッチサイズより少ない場合は最後のページ
            if (count($pages) < $batch_size) {
                break;
            }

            $page_number++;
        }

        // 投稿も同様にバッチ処理
        $post_paged = 1;
        while (true) {
            $posts = get_posts(array(
                'post_type' => 'post',
                'post_status' => 'publish',
                'posts_per_page' => $batch_size,
                'paged' => $post_paged,
                'orderby' => 'date',
                'order' => 'DESC'
            ));

            if (empty($posts)) {
                break;
            }

            foreach ($posts as $post) {
                $urls[] = get_permalink($post->ID);
            }

            if (count($posts) < $batch_size) {
                break;
            }

            $post_paged++;
        }

        $categories = get_categories(array(
            'hide_empty' => true
        ));
        foreach ($categories as $category) {
            $urls[] = get_category_link($category->term_id);
        }

        $tags = get_tags(array(
            'hide_empty' => true
        ));
        foreach ($tags as $tag) {
            $urls[] = get_tag_link($tag->term_id);
        }

        $urls = array_unique($urls);

        return $urls;
    }
    
    private function lw_cache_generate_single_page($url) {
        $parsed_url = parse_url($url);
        $path = isset($parsed_url['path']) ? $parsed_url['path'] : '/';
        
        $cache_file = $this->lw_cache_get_cache_path($path);
        
        $html = $this->lw_cache_fetch_html($url);
        
        if (empty($html)) {
            return false;
        }
        
        $cache_dir = dirname($cache_file);
        if (!file_exists($cache_dir)) {
            wp_mkdir_p($cache_dir);
        }
        
        return file_put_contents($cache_file, $html) !== false;
    }
    
    private function lw_cache_fetch_html($url) {
        $response = wp_remote_get($url, array(
            'timeout' => 30,
            'sslverify' => false,
            'headers' => array(
                'User-Agent' => 'LiteWord-Cache-Generator'
            )
        ));
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $html = wp_remote_retrieve_body($response);
        
        return $html;
    }
    
    private function lw_cache_get_cache_path($path) {
        $path = trim($path, '/');
        
        if (empty($path)) {
            return $this->cache_dir . '/index.html';
        }
        
        return $this->cache_dir . '/' . $path . '/index.html';
    }
    
    public function lw_cache_clear_all() {
        if (!current_user_can('manage_options')) {
            wp_die('権限がありません');
        }
        
        check_admin_referer('lw_cache_clear_all');
        
        $this->lw_cache_delete_directory($this->cache_dir);
        
        wp_redirect(add_query_arg(
            array(
                'page' => 'lw-cache',
                'message' => 'cleared'
            ),
            admin_url('admin.php')
        ));
        exit;
    }
    
    public function lw_cache_clear_on_update($post_id, $post) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        if (wp_is_post_revision($post_id)) {
            return;
        }
        
        $url = get_permalink($post_id);
        $this->lw_cache_clear_single_page($url);
        
        $this->lw_cache_clear_single_page(home_url('/'));
    }
    
    private function lw_cache_clear_single_page($url) {
        $parsed_url = parse_url($url);
        $path = isset($parsed_url['path']) ? $parsed_url['path'] : '/';
        $cache_file = $this->lw_cache_get_cache_path($path);
        
        if (file_exists($cache_file)) {
            unlink($cache_file);
        }
    }
    
    private function lw_cache_create_cache_dir() {
        if (!file_exists($this->cache_dir)) {
            wp_mkdir_p($this->cache_dir);
        }
        
        $htaccess_file = $this->cache_dir . '/.htaccess';
        if (!file_exists($htaccess_file)) {
            file_put_contents($htaccess_file, "Options -Indexes\n");
        }
    }
    
    private function lw_cache_delete_directory($dir) {
        if (!file_exists($dir)) {
            return true;
        }
        
        if (!is_dir($dir)) {
            return unlink($dir);
        }
        
        foreach (scandir($dir) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }
            
            if (!$this->lw_cache_delete_directory($dir . DIRECTORY_SEPARATOR . $item)) {
                return false;
            }
        }
        
        return rmdir($dir);
    }
    
    private function lw_cache_count_files() {
        if (!file_exists($this->cache_dir)) {
            return 0;
        }
        
        $count = 0;
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->cache_dir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'html') {
                $count++;
            }
        }
        
        return $count;
    }
    
    private function lw_cache_get_size() {
        if (!file_exists($this->cache_dir)) {
            return '0 B';
        }
        
        $size = 0;
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->cache_dir, RecursiveDirectoryIterator::SKIP_DOTS)
        );
        
        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $size += $file->getSize();
            }
        }
        
        return $this->lw_cache_format_bytes($size);
    }
    
    private function lw_cache_format_bytes($bytes) {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}

new LW_Cache_Manager();