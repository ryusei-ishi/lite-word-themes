<?php
if (!defined('ABSPATH')) exit;
/**
 * 1) フォームセットのIDを決定
 */
$form_set_no = sanitize_text_field($args);
?>
<div class="none_plugin_message"></div>
<div class="lw_mail_form_wrap reset bg_color">
    <?=lw_mail_set_header("問合せフォーム $form_set_no 「送信ボタンの設定」")?>
    <?=lw_mail_set_tab_menu($form_set_no)?>
    <div class="lw_mail_send_set">
        <form action="" method="post">
            <dl>
                <dt>送信ボタンテキスト</dt>
                <dd>
                    <?=Lw_opt_text("form_send_set_{$form_set_no}_subject_button")?>
                    <p>送信ボタンのテキストとして設定されます</p>
                </dd>
                <input style="grid-column: span 2;" type="submit" value="変更内容を保存する" class="Lw_mail_setting_form_submit">
            </dl>
        </form>
    </div>
</div>
