<?php
if (!defined('ABSPATH')) exit;
$form_set_no = sanitize_text_field($args);
?>
<div class="none_plugin_message"></div>
<div class="lw_mail_form_wrap reset bg_color">
    <?=lw_mail_set_header("問合せフォーム $form_set_no 「同意チェックや規約、プラポなどの設定」")?>
    <?=lw_mail_set_tab_menu($form_set_no)?>
    <div class="lw_mail_send_set">
        <form action="" method="post">
            <dl>
                <dt>表示 / 非表示</dt>
                <dd>
                    <?=Lw_opt_select("form_consent_set_{$form_set_no}_switch",[
                        'on' => '表示',
                        'off' => '非表示'
                    ])?>
                    <p>送信ボタンの上に同意チェックを表示する場合は「表示」を選択してください。</p>
                </dd>
                <dt>タイプの選択</dt>
                <dd>
                    <?=Lw_opt_select("form_consent_set_{$form_set_no}_type",[
                        'type_url' => 'URLで規約ページのリンク先を指定',
                        'type_text' => '送信ボタンの上に文章の表示'
                    ])?>
                </dd>
                <dt>URL</dt>
                <dd>
                    <?=Lw_opt_text("form_consent_set_{$form_set_no}_url")?>
                    <p>例）<?=home_url()?>/privacy-policy</p>
                <dt>ラベルテキスト</dt>
                <dd>
                    <?=Lw_opt_text("form_consent_set_{$form_set_no}_label")?>
                    <p>例）「利用規約」、「プライバシーポリシー」など</p>
                </dd>
                <dd style="grid-column: span 2;">
                    <?=Lw_opt_editor("form_consent_set_{$form_set_no}_p",[
                        'media_buttons' => false,  // メディアアップロードボタンの有無
                        'teeny' => false,         // 簡易エディタモード（falseでフル機能）
                        'quicktags' => true,      // クイックタグの有無
                        'editor_height' => 300,    // エディタの高さ
                        'tinymce' => [
                            'block_formats' => '見出し2=h2; 見出し3=h3; 見出し4=h4; 段落=p;', // H3, H4, P のみ使用可能にする
                        ]
                    ])?>
                </dd>
                <input style="grid-column: span 2;" type="submit" value="変更内容を保存する" class="Lw_mail_setting_form_submit">
            </dl>
        </form>
    </div>
</div>