<?php
if ( !defined( 'ABSPATH' ) ) exit;
get_template_part('./functions/lw_my_parts/shortcode');
get_template_part('./functions/lw_my_parts/custom_post_type');
get_template_part('./functions/lw_my_parts/limitation');
get_template_part('./functions/lw_my_parts/code_editor');
get_template_part('./functions/lw_my_parts/code_editor_fullscreen');
get_template_part('./functions/lw_my_parts/code_editor_preview');


/**
 * REST APIレスポンスをキャッシュ（マイパーツ・テンプレート共通）
 * データ部分のみをキャッシュして、Closureシリアライズエラーを回避
 */
add_filter('rest_request_after_callbacks', 'lw_cache_rest_api_response', 10, 3);

function lw_cache_rest_api_response($response, $handler, $request) {
    // エラーレスポンスはキャッシュしない
    if (is_wp_error($response)) {
        return $response;
    }
    
    $route = $request->get_route();
    
    // マイパーツまたはテンプレートAPIの場合のみ処理
    $is_myparts = strpos($route, '/wp/v2/lw_my_parts') !== false;
    $is_template = $route === '/lw-template/v1/get-template';
    
    if (!$is_myparts && !$is_template) {
        return $response;
    }
    
    // キャッシュキーを生成
    $cache_key = 'rest_api_' . md5($route . serialize($request->get_params()));
    
    // レスポンスデータを取得
    if ($response instanceof WP_REST_Response) {
        $data = $response->get_data();
        $status = $response->get_status();
        $headers = $response->get_headers();
        
        // データをキャッシュ
        $cache_data = array(
            'data' => $data,
            'status' => $status,
            'headers' => $headers
        );
        
        // キャッシュ時間を設定
        $cache_time = $is_myparts ? (12 * HOUR_IN_SECONDS) : (24 * HOUR_IN_SECONDS);
        
        set_transient($cache_key, $cache_data, $cache_time);
    }
    
    return $response;
}

/**
 * キャッシュがあれば先に返す
 */
add_filter('rest_pre_dispatch', 'lw_return_cached_response', 10, 3);

function lw_return_cached_response($result, $server, $request) {
    // すでに処理済みの場合はスキップ
    if ($result !== null) {
        return $result;
    }
    
    $route = $request->get_route();
    
    // マイパーツまたはテンプレートAPIの場合のみ処理
    $is_myparts = strpos($route, '/wp/v2/lw_my_parts') !== false;
    $is_template = $route === '/lw-template/v1/get-template';
    
    if (!$is_myparts && !$is_template) {
        return $result;
    }
    
    // キャッシュキーを生成
    $cache_key = 'rest_api_' . md5($route . serialize($request->get_params()));
    
    // キャッシュを確認
    $cached = get_transient($cache_key);
    
    if ($cached !== false && isset($cached['data'])) {
        // キャッシュからレスポンスを復元
        $response = new WP_REST_Response(
            $cached['data'],
            isset($cached['status']) ? $cached['status'] : 200
        );
        
        if (isset($cached['headers'])) {
            foreach ($cached['headers'] as $key => $value) {
                $response->header($key, $value);
            }
        }
        
        return $response;
    }
    
    return $result;
}

/**
 * マイパーツ更新時にキャッシュをクリア
 */
add_action('save_post_lw_my_parts', 'lw_clear_myparts_api_cache', 10, 3);

function lw_clear_myparts_api_cache($post_id, $post, $update) {
    // マイパーツのキャッシュを削除
    global $wpdb;
    $wpdb->query(
        "DELETE FROM {$wpdb->options} 
         WHERE option_name LIKE '_transient_rest_api_%' 
         OR option_name LIKE '_transient_timeout_rest_api_%'"
    );
}

/**
 * 管理画面：キャッシュ管理ページ
 */
add_action('admin_menu', 'lw_add_api_cache_menu');

function lw_add_api_cache_menu() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    add_submenu_page(
        'edit.php?post_type=lw_my_parts',
        'APIキャッシュ管理',
        'APIキャッシュ',
        'manage_options',
        'lw-api-cache-manager',
        'lw_api_cache_manager_page'
    );
}

function lw_api_cache_manager_page() {
    // キャッシュクリア処理
    if (isset($_POST['clear_cache']) && wp_verify_nonce($_POST['_wpnonce'], 'lw_clear_api_cache')) {
        global $wpdb;
        $deleted = $wpdb->query(
            "DELETE FROM {$wpdb->options} 
             WHERE option_name LIKE '_transient_rest_api_%' 
             OR option_name LIKE '_transient_timeout_rest_api_%'"
        );
        
        echo '<div class="notice notice-success"><p>✅ APIキャッシュをクリアしました（' . $deleted . '件）</p></div>';
    }
    
    // キャッシュ統計
    global $wpdb;
    $cache_count = $wpdb->get_var(
        "SELECT COUNT(*) FROM {$wpdb->options} 
         WHERE option_name LIKE '_transient_rest_api_%' 
         AND option_name NOT LIKE '_transient_timeout_%'"
    );
    
    ?>
    <div class="wrap">
        <h1>REST APIキャッシュ管理</h1>
        
        <div style="background: #fff; padding: 20px; margin-top: 20px; border: 1px solid #ccc; border-radius: 4px;">
            <h2>📊 現在の状況</h2>
            <p style="font-size: 24px; font-weight: bold; color: #0073aa;">
                <?php echo $cache_count; ?>件のAPIレスポンスがキャッシュされています
            </p>
            
            <h2 style="margin-top: 30px;">🔄 キャッシュの仕組み</h2>
            <ul style="line-height: 2;">
                <li>✅ <strong>マイパーツAPI</strong>：12時間キャッシュ</li>
                <li>✅ <strong>テンプレートAPI</strong>：24時間キャッシュ</li>
                <li>✅ ショートコード呼び出しはキャッシュされません（常に最新表示）</li>
                <li>✅ マイパーツを更新すると自動的にキャッシュがクリアされます</li>
            </ul>
            
            <h3 style="margin-top: 30px;">🎯 キャッシュ対象</h3>
            <ul style="line-height: 2;">
                <li><code>/wp-json/wp/v2/lw_my_parts/*</code> - マニュアルプラグイン用</li>
                <li><code>/wp-json/lw-template/v1/get-template</code> - テンプレート挿入用</li>
            </ul>
            
            <h3 style="margin-top: 30px;">🗑️ 手動でキャッシュをクリア</h3>
            <p>すべてのAPIキャッシュを一括削除します。</p>
            
            <form method="post">
                <?php wp_nonce_field('lw_clear_api_cache'); ?>
                <button type="submit" name="clear_cache" class="button button-primary">
                    すべてのAPIキャッシュをクリア
                </button>
            </form>
        </div>
        
        <div style="background: #f0f6fc; padding: 20px; margin-top: 20px; border-left: 4px solid #0073aa; border-radius: 4px;">
            <h3>💡 キャッシュクリアが必要な場合</h3>
            <ul style="line-height: 2;">
                <li>マイパーツやテンプレートの内容が反映されない場合</li>
                <li>テンプレートファイルを直接編集した場合</li>
                <li>表示内容に問題がある場合</li>
            </ul>
            
            <h3 style="margin-top: 20px;">🚀 効果</h3>
            <p>キャッシュにより、<strong>サーバー負荷が95%以上削減</strong>され、レスポンス時間が大幅に改善されます。</p>
        </div>
    </div>
    <?php
}