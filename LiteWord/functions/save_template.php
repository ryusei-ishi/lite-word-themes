<?php
if ( ! defined( 'ABSPATH' ) ) exit;
add_action('admin_post_lw_save_full_templates', 'lw_save_full_templates_to_db');
function lw_save_full_templates_to_db() {
    if (!current_user_can('administrator')) {
        wp_die('アクセス権限がありません。');
    }

    if (!isset($_POST['purchases'])) {
        wp_die('データがありません。');
    }

    global $wpdb;
    $table = $wpdb->prefix . 'lw_template_setting';
    $purchases = json_decode(stripslashes($_POST['purchases']), true);

    if (!is_array($purchases)) {
        wp_die('不正な形式です。');
    }

    foreach ($purchases as $item) {
        $template_id = sanitize_text_field($item['template_id']);
        $purchase_date = sanitize_text_field($item['purchase_date']);
        $active_flag = intval($item['active_flag']);

        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE template_id = %s",
            $template_id
        ));

        if (!$exists) {
            $wpdb->insert($table, [
                'template_id' => $template_id,
                'timestamp'   => $purchase_date,
                'active_flag' => $active_flag,
            ], [
                '%s', '%s', '%d'
            ]);
        }
    }

    wp_redirect(admin_url('admin.php?page=liteword_template_activate&result=success'));
    exit;
}

