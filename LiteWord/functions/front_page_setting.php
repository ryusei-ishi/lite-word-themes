<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action('wp_ajax_set_homepage', 'Lw_ajax_set_homepage');
function Lw_ajax_set_homepage() {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('権限がありません');
    }

    if (!isset($_POST['page_id']) || !is_numeric($_POST['page_id'])) {
        wp_send_json_error('無効なページIDです');
    }

    $page_id = (int) $_POST['page_id'];

    // フロントページとして設定
    update_option('show_on_front', 'page');
    update_option('page_on_front', $page_id);

    wp_send_json_success('フロントページに設定しました');
}
