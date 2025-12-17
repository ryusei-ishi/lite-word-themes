<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LINEブラウザかどうかを判定
 * @return bool LINEブラウザの場合はtrue
 */
function is_line_browser() {
    $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
    // LINEアプリ内ブラウザのUser-Agentには"Line"が含まれる
    return (stripos($user_agent, 'Line') !== false);
}

/**
 * reCAPTCHAが実行可能かどうかを判定
 * @return bool 実行可能な場合はtrue
 */
function can_use_recaptcha() {
    // 設定が有効かつLINEブラウザでない場合のみtrue
    $recaptcha_enabled = get_option('lw_recaptcha_switch', '') === 'on';
    return $recaptcha_enabled && !is_line_browser();
}

// JavaScriptの読み込み（適切なフックで実行）
function lw_enqueue_mail_form_scripts() {
    wp_enqueue_script(
        'Lw_setting_form_js',
        get_template_directory_uri() . '/functions/mail_form/send.js',
        array('jquery'),
        '1.0',
        true
    );
    wp_localize_script('Lw_setting_form_js', 'lw_mail_form', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('lw_mail_form_nonce'),
        'recaptcha_site_key' => can_use_recaptcha() ? get_option('lw_form_recaptcha_site_key', '') : ''
    ]);
}
add_action('wp_enqueue_scripts', 'lw_enqueue_mail_form_scripts');

//header部分
function lw_mail_set_header($title = "" , $btn_type = "submit" , $btn_text = "変更内容を保存する" , $btn_link = "" ,$set_no = "1") {
    ?>
    <header class="lw_mail_set_header">
        <h1><?=hh($title)?></h1>
        <?php
        $form_memo = get_option("lw_mail_form_memo_".$set_no, "");
        
        ?>
        <p><?= brSt($form_memo) ?></p>
        <div class="save_btn_wrap">
            <?php if($btn_type == "link"):?>
                <a class="link_btn" href="<?=$btn_link?>"><?=$btn_text?></a>
            <?php endif;?>
        </div>
    </header>
    <?php if($btn_type == "submit"):?>
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                // フォームの外に新しいボタンを作成
                let newButton = document.createElement("button");
                newButton.textContent = "変更内容を保存する";
                newButton.classList.add("Lw_mail_setting_form_submit"); // クラス追加

                // クリック時にフォームを送信
                newButton.addEventListener("click", function() {
                    // 対象のフォームをすべて取得
                    let forms = document.querySelectorAll(".lw_mail_send_set form, .lw_mail_form_set_wrap form");
                    forms.forEach(function(form) {
                        form.submit();
                    });
                });

                // `form` の外に挿入
                let saveBtnWrap = document.querySelector(".save_btn_wrap");
                if (saveBtnWrap) {
                    saveBtnWrap.appendChild(newButton);
                }
            });
        </script>

    <?php
        endif;
}

//管理画面のタブ切り替え部分
function lw_mail_set_tab_menu($form_set_no = "") {
    $icon = '<svg style="height:12px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>';
    if(!empty($form_set_no)):
    ?>
    <nav class="lw_mail_set_nav_menu">
        <ul>
            <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set&form_set=<?= $form_set_no ?>">フォームの項目設定<?=$icon?></a></li>
            <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set&form_send_button=<?= $form_set_no ?>">送信ボタン設定<?=$icon?></a></li>
            <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set&form_send_set=<?= $form_set_no ?>">受信メール設定<?=$icon?></a></li>
            <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set&form_consent_set=<?= $form_set_no ?>">同意・規約などの設定<?=$icon?></a></li>
            <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set&form_thanks_page_set=<?= $form_set_no ?>">サンクスページ設定<?=$icon?></a></li>
            <?php 
                if(LW_EXPANSION_BASE):
            ?>
                <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set&form_thanks_mail_set=<?= $form_set_no ?>">サンクスメール設定<?=$icon?></a></li>
            <?php endif;?>
            <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set&form_page=recaptcha">reCAPTCHA設定<?=$icon?></a></li>
            <?php 
                if(LW_EXPANSION_BASE):
            ?>
            <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set&form_reception_history_list=<?= $form_set_no ?>">受信履歴<?=$icon?></a></li>
            <?php endif;?>
        </ul>
    </nav>
    <?php else:?>
        <nav class="lw_mail_set_nav_menu">
        <ul>
            <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set">フォームの選択<?=$icon?></a></li>
            <li><a href="<?= admin_url() ?>admin.php?page=lw_mail_form_set&form_page=recaptcha">reCAPTCHA設定<?=$icon?></a></li>
        </ul>
    </nav>
    <?php endif;?>
    
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        // 現在のURL
        var currentUrl = window.location.href;

        // 余分なスラッシュを取り除く正規化関数
        function normalizeUrl(url) {
            // http:// や https:// の後ろ以外の連続スラッシュを一つにまとめる
            return url.replace(/([^:]\/)\/+/g, '$1');
        }

        // 正規化した現在のURL
        var normalizedCurrent = normalizeUrl(currentUrl);

        // メニュー内のリンクを取得
        var links = document.querySelectorAll('.lw_mail_set_nav_menu a');

        links.forEach(function(link) {
            var normalizedLinkHref = normalizeUrl(link.href);

            // 正規化後のURL同士を比較
            if (normalizedLinkHref === normalizedCurrent) {
                link.classList.add('current');
            }
        });
    });
    </script>
    <?php
}


/** ----------------------------------------------------------
 *  Mail 履歴 1件削除
 *  URL例:
 *  /wp-admin/admin-post.php?action=lw_mail_del_row
 *      &row_id=123&form_set_no=4&_wpnonce=xxxxxxxx
 * -------------------------------------------------------- */
add_action( 'admin_post_lw_mail_del_row', function () {

	// ── CSRF
	if ( ! wp_verify_nonce( $_REQUEST['_wpnonce'] ?? '', 'lw_mail_hist_nonce' ) ) {
		wp_die( 'Security check!' );
	}

	$row_id = intval( $_REQUEST['row_id'] ?? 0 );
	$form   = intval( $_REQUEST['form_set_no'] ?? 0 );

	if ( $row_id ) {
		global $wpdb;
		$wpdb->delete(
			$wpdb->prefix . 'lw_mail_reception_history',
			[ 'id' => $row_id ],
			[ '%d' ]
		);
	}

	wp_safe_redirect( add_query_arg(
		[
			'page'                       => 'lw_mail_form_set',
			'form_reception_history_list'=> $form
		],
		admin_url( 'admin.php' )
	) );
	exit;
});


/** ----------------------------------------------------------
 *  Mail 履歴 全削除
 *  URL例:
 *  /wp-admin/admin-post.php?action=lw_mail_del_all
 *      &form_set_no=4&_wpnonce=xxxxxxxx
 * -------------------------------------------------------- */
add_action( 'admin_post_lw_mail_del_all', function () {

	if ( ! wp_verify_nonce( $_REQUEST['_wpnonce'] ?? '', 'lw_mail_hist_nonce' ) ) {
		wp_die( 'Security check!' );
	}

	$form = intval( $_REQUEST['form_set_no'] ?? 0 );

	if ( $form ) {
		global $wpdb;
		$wpdb->delete(
			$wpdb->prefix . 'lw_mail_reception_history',
			[ 'form_set_no' => $form ],
			[ '%d' ]
		);
	}

	wp_safe_redirect( add_query_arg(
		[
			'page'                       => 'lw_mail_form_set',
			'form_reception_history_list'=> $form
		],
		admin_url( 'admin.php' )
	) );
	exit;
});
/**
 * フォームの有効/無効を切り替えるAjax処理
 */
add_action('wp_ajax_lw_toggle_form_status', 'lw_toggle_form_status_handler');
function lw_toggle_form_status_handler() {
    // Nonce検証
    if (!wp_verify_nonce($_POST['nonce'], 'lw_toggle_form_nonce')) {
        wp_send_json_error(['message' => 'セキュリティチェックに失敗しました']);
        return;
    }
    
    // 権限チェック
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => '権限がありません']);
        return;
    }
    
    // パラメータ取得
    $form_id = intval($_POST['form_id']);
    $status = sanitize_text_field($_POST['status']);
    
    // バリデーション
    if ($form_id < 1 || !in_array($status, ['on', 'off'])) {
        wp_send_json_error(['message' => '不正なパラメータです']);
        return;
    }
    
    // オプション更新
    $option_name = 'lw_mail_form_status_' . $form_id;
    $result = update_option($option_name, $status);
    
    if ($result !== false) {
        wp_send_json_success([
            'message' => 'ステータスを更新しました',
            'form_id' => $form_id,
            'status' => $status
        ]);
    } else {
        wp_send_json_error(['message' => 'データベースの更新に失敗しました']);
    }
}

/**
 * フォームの状態を取得する関数
 */
function lw_get_form_status($form_id) {
    return get_option('lw_mail_form_status_' . $form_id, 'on');
}

/**
 * フォームが有効かどうかをチェックする関数
 */
function lw_is_form_enabled($form_id) {
    return lw_get_form_status($form_id) === 'on';
}