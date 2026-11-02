<?php
if (!defined('ABSPATH')) exit;

$message = '';

// JSONアップロード処理
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_activation'])) {
    if (!current_user_can('administrator')) {
        wp_die('アクセス権限がありません。');
    }
    // （2026-11-02 の点検 T12）ほかのサイトから送らせた POST で反映処理を走らせないよう、この画面のフォームから来たかを確かめる
    // （隣の lw_template_activate.php と同じ check_admin_referer の形）
    check_admin_referer('lw_activate_json_action', 'lw_activate_json_nonce');

    if (isset($_FILES['activation_file']) && $_FILES['activation_file']['error'] === UPLOAD_ERR_OK) {
        $json = file_get_contents($_FILES['activation_file']['tmp_name']);
        $data = json_decode($json, true);

        // 必須項目の確認
        if (empty($data['activated']) || empty($data['token']) || empty($data['purchases']) || !is_array($data['purchases'])) {
            $message = '<div class="error_message"><p>JSONファイルの内容が不正です。</p></div>';
        } else {
            $token = sanitize_text_field($data['token']);

            // トークン認証＆購入履歴取得
            $verify_response = wp_remote_get("https://shop.lite-word.com/wp-json/liteword/v1/secure-purchase-history?token=" . urlencode($token));

            if (is_wp_error($verify_response)) {
                $message = '<div class="error_message"><p>API通信エラー：' . esc_html($verify_response->get_error_message()) . '</p></div>';
            } else {
                $verify_body = wp_remote_retrieve_body($verify_response);
                $verify_data = json_decode($verify_body, true);
                // （2026-11-02 の点検 T11）ショップの応答の全文（購入者の情報が入りうる）はログに書かない。状態と件数だけ
                error_log(sprintf(
                    '[LiteWord] 認証レスポンス: HTTP %d / success=%s / 購入 %d 件',
                    (int) wp_remote_retrieve_response_code($verify_response),
                    empty($verify_data['success']) ? 'no' : 'yes',
                    (isset($verify_data['purchases']) && is_array($verify_data['purchases'])) ? count($verify_data['purchases']) : 0
                ));

                // トークン無効またはレスポンス異常
                if (empty($verify_data['success']) || empty($verify_data['purchases'])) {
                    $message = '<div class="error_message"><p>トークンが無効です。正しいアクティベーションファイルを使用してください。</p></div>';
                } else {
                    // データ保存処理
                    global $wpdb;
                    $table = $wpdb->prefix . 'lw_template_setting';

                    foreach ($verify_data['purchases'] as $item) {
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
                            ], ['%s', '%s', '%d']);
                            error_log("[LiteWord] 保存成功: {$template_id}");
                        } else {
                            error_log("[LiteWord] スキップ（既に存在）: {$template_id}");
                        }
                    }

                    $message = '<div class="up_message"><p>トークン認証とテンプレート保存に成功しました！</p></div>';
                }
            }
        }
    } else {
        $message = '<div class="error_message"><p>ファイルのアップロードに失敗しました。</p></div>';
    }
}
?>

<div class="template_activation_page">
    <h1>LiteWord テンプレート アクティベーション</h1>

    <p>LiteWordショップで発行されたアクティベーションファイル（.json）をアップロードしてください。<br>
    トークンの認証を行ったうえでテンプレートが保存されます。</p>

    <form method="post" enctype="multipart/form-data">
        <?php wp_nonce_field('lw_activate_json_action', 'lw_activate_json_nonce'); // 2026-11-02 の点検 T12 ?>
        <input type="file" name="activation_file" accept=".json" required><br>
        <button type="submit" name="upload_activation" class="button button-primary">アップロードして保存</button>
    </form>

    <div>
        <?= $message ?>
    </div>
</div>

