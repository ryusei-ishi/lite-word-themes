<?php
if (!defined('ABSPATH')) exit;
?>
<div class="none_plugin_message"></div>
<div class="lw_mail_form_wrap reset bg_color">

    <?=lw_mail_set_header("全問い合わせフォーム共通 「Google reCAPTCHA v3 設定」")?>
    <?=lw_mail_set_tab_menu()?>
    <div class="lw_mail_send_set">
        <p>スパムボットによる不正な送信を防ぐために <strong>Google reCAPTCHA v3</strong> を設定する事ができます。</p>
        <p>reCAPTCHA v3 は、ユーザーの操作を妨げることなくスコア判定により不正なアクセスを検出する仕組みです。サイトキーとシークレットキーを取得し、以下に入力してください。</p>
        <p><strong>※ reCAPTCHA v3 のみ対応しています。v2 のキーは使用できません。</strong></p>
        <p>reCAPTCHA v3 のキーを取得するには、<a href="https://www.google.com/recaptcha/admin" target="_blank">Google reCAPTCHA 管理ページ</a> にアクセスし、「<strong>reCAPTCHA v3</strong>」の設定を作成してください。</p>
        <form action="" method="post">
            <dl>
                <dt>有効 / 無効</dt>
                <dd>
                    <?=Lw_opt_select("lw_recaptcha_switch",[
                        "on" => '有効'
                    ],"無効")?>
                </dd>
                <dt>サイトキー</dt>
                <dd>
                    <?=Lw_opt_text("lw_form_recaptcha_site_key")?>
                    <p>例）6LcXXXXXAAAAAABBXXXXX</p>
                </dd>
                <dt>シークレットキー</dt>
                <dd>
                    <?=Lw_opt_text("lw_form_recaptcha_secret_key")?>
                    <p>例）6LcXXXXXAAAAAABBXXXXX</p>
                </dd>
                <dt>reCAPTCHAの表記の有無</dt>
                <dd>
                    <?=Lw_opt_select("lw_recaptcha_display",[
                        "on" => '表示',
                        "off" => '非表示'
                    ])?>
                </dd>
                <input style="grid-column: span 2;" type="submit" value="変更内容を保存する" class="Lw_mail_setting_form_submit">
            </dl>
        </form>
    </div>
</div>
