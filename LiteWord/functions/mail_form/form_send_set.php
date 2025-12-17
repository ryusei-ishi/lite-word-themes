<?php
if (!defined('ABSPATH')) exit;
/**
 * 1) フォームセットのIDを決定
 */
$form_set_no = sanitize_text_field($args);
?>
<div class="none_plugin_message"></div>
<div class="lw_mail_form_wrap reset bg_color">
    <?=lw_mail_set_header("問合せフォーム $form_set_no 「メール受信設定」")?>
    <?=lw_mail_set_tab_menu($form_set_no)?>
    <div class="lw_mail_send_set">
        <form action="" method="post">
            <dl>
                <dt>件名</dt>
                <dd>
                    <?=Lw_opt_text("form_send_set_{$form_set_no}_subject")?>
                    <p>メールの件名として設定され、受信者が受け取る際に表示されます。<br>例）「ホームページからお問い合わせがありました！」</p>
                </dd>
                <dt>送信先メールアドレス</dt>
                <dd>
                    <?=Lw_opt_text("form_send_set_{$form_set_no}_to_mail")?>
                    <p>
                        メールを送る相手（受信者）のメールアドレスを指定します。<br>
                        カンマ区切りで複数のメールアドレスを設定できます。
                        <br>例）info@<?= parse_url(home_url(), PHP_URL_HOST) ?>,sales@<?= parse_url(home_url(), PHP_URL_HOST) ?>
                    </p>
                </dd>
                <dt>送信元会社名 or お名前</dt>
                <dd>
                    <?=Lw_opt_text("form_send_set_{$form_set_no}_from_name")?>
                    <p>
                        送信者の名前または会社名として、受信者に表示されます。
                        <br>例）<?= get_bloginfo('name') ?>担当者
                    </p>
                </dd>
                <dt>送信元メールアドレス</dt>
                <dd>
                    <?=Lw_opt_text("form_send_set_{$form_set_no}_from_mail")?>
                    <p>
                        送信者のメールアドレスとして設定され、受信者が返信する際の宛先になります。<br>
                        例）info@<?= parse_url(home_url(), PHP_URL_HOST) ?>
                    </p>
                </dd>
                <input style="grid-column: span 2;" type="submit" value="変更内容を保存する" class="Lw_mail_setting_form_submit">
            </dl>
        </form>
    </div>
</div>
