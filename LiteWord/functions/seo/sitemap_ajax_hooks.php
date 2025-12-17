<?php
/**
 * LiteWord SEO - サイトマップAjax処理とフック
 * Ajax保存処理と自動Ping送信機能
 */

if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'wp_ajax_lw_save_noindex', function() {
    if ( ! wp_verify_nonce( $_POST['nonce'], 'lw_sitemap_control' ) ) {
        wp_send_json_error( 'Nonce verification failed' );
        return;
    }
    
    $type = sanitize_text_field( $_POST['type'] );
    $id = intval( $_POST['id'] );
    $noindex = $_POST['noindex'] === 'true';
    
    switch ( $type ) {
        case 'post':
        case 'page':
            if ( $noindex ) {
                update_post_meta( $id, 'seo_noindex', 'noindex' );
            } else {
                delete_post_meta( $id, 'seo_noindex' );
            }
            break;
            
        case 'category':
            if ( $noindex ) {
                update_term_meta( $id, 'category_noindex', 'noindex' );
            } else {
                delete_term_meta( $id, 'category_noindex' );
            }
            break;
            
        case 'tag':
            if ( $noindex ) {
                update_term_meta( $id, 'term_noindex', 'noindex' );
            } else {
                delete_term_meta( $id, 'term_noindex' );
            }
            break;
            
        case 'author':
            if ( $noindex ) {
                delete_user_meta( $id, 'user_noindex' ); // デフォルトがnoindex
            } else {
                update_user_meta( $id, 'user_noindex', 'follow' );
            }
            break;
    }
    
    // キャッシュ更新
    if ( class_exists( 'LW_SEO_Sitemap_Control' ) ) {
        LW_SEO_Sitemap_Control::rebuild_noindex_cache();
    }
    
    wp_send_json_success();
});

// 投稿公開時の自動Ping
add_action( 'publish_post', function( $post_id ) {
    $settings = LW_Sitemap_Settings::get_settings();
    
    if ( $settings['ping']['ping_on_publish'] ) {
        LW_Sitemap_Settings::send_ping();
    }
    
    if ( $settings['cache']['auto_regenerate'] ) {
        LW_Sitemap_Settings::clear_cache();
    }
});




// llms.txtプレビュー用Ajax処理
add_action('wp_ajax_lw_preview_llms_txt', function() {
    if (!wp_verify_nonce($_POST['nonce'], 'lw_sitemap_control')) {
        wp_send_json_error('Nonce verification failed');
    }
    
    $settings = $_POST['settings'];
    $content = LW_Sitemap_Settings::generate_llms_txt_preview($settings);
    
    wp_send_json_success(['content' => $content]);
});

// llms.txt生成Ajax処理
add_action('wp_ajax_lw_generate_llms_txt', function() {
    if (!wp_verify_nonce($_POST['nonce'], 'lw_sitemap_control')) {
        wp_send_json_error('Nonce verification failed');
    }
    
    $settings = $_POST['settings'];
    $result = LW_Sitemap_Settings::generate_llms_txt_from_settings($settings);
    
    if ($result) {
        $status = sprintf(
            '<span class="success">✓ 生成完了</span> | 
             <a href="%s" target="_blank">llms.txtを表示</a> | 
             最終更新: %s',
            home_url('/llms.txt'),
            date('Y/m/d H:i')
        );
        wp_send_json_success(['status' => $status]);
    } else {
        wp_send_json_error(['message' => '生成に失敗しました']);
    }
});