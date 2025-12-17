<?php
if ( !defined( 'ABSPATH' ) ) exit;

//関数の読み込み
get_template_part('./functions/mail_form/functions');
//ショートコードとしてフォームを表示
get_template_part('./functions/mail_form/form_put');
//送信処理
get_template_part('./functions/mail_form/mail-ajax');
//mail_download_csv
get_template_part('./functions/mail_form/mail_download_csv');

// メニュー追加
add_action('admin_menu', 'lw_mail_form_menu');
function lw_mail_form_menu() {
    add_menu_page('Lwお問い合わせ', 'Lwお問い合わせ', 'manage_options', 'lw_mail_form_set', 'lw_mail_form_set_list', 'dashicons-email', 22);
}

function lw_mail_form_set_list() {
    // スタイル読み込み (必要に応じて変更)
    wp_enqueue_style('Lw_setting_form', get_template_directory_uri() . '/functions/mail_form/style.min.css', array(), css_version(), 'all');

    //各ページの読み込み
    if (isset($_GET['form_set']) && $_GET['form_set'] != "") {
        $form_no = hh($_GET['form_set']);
        get_template_part('./functions/mail_form/form_set', "", $form_no);
    } 
    elseif (isset($_GET['form_send_button']) && $_GET['form_send_button'] != "") {
        $form_no = hh($_GET['form_send_button']);
        get_template_part('./functions/mail_form/form_send_button', "", $form_no);
    } 
    elseif (isset($_GET['form_send_set']) && $_GET['form_send_set'] != "") {
        $form_no = hh($_GET['form_send_set']);
        get_template_part('./functions/mail_form/form_send_set', "", $form_no);
    } 
    elseif (isset($_GET['form_consent_set']) && $_GET['form_consent_set'] != "") {
        $form_no = hh($_GET['form_consent_set']);
        get_template_part('./functions/mail_form/form_consent_set', "", $form_no);
    } 
    elseif (isset($_GET['form_thanks_mail_set']) && $_GET['form_thanks_mail_set'] != "") {
        $mail_form_thanks_mail_switch = Lw_theme_mod_set("lw_extensions_mail_form_thanks_mail_switch", "on");
        if($mail_form_thanks_mail_switch !== "on") {
            echo '<div class="notice notice-error"><p>サンクスメール機能が無効になっています。<br>有効にするには、<a href="' . admin_url('customize.php?autofocus[section]=lw_extensions_sec') . '">カスタマイザー</a>から設定してください。</p></div>';
            return;
        }
        $form_no = hh($_GET['form_thanks_mail_set']);
        get_template_part('./functions/mail_form/form_thanks_mail_set', "", $form_no);
    } 
    elseif (isset($_GET['form_thanks_page_set']) && $_GET['form_thanks_page_set'] != "") {
        $form_no = hh($_GET['form_thanks_page_set']);
        get_template_part('./functions/mail_form/form_thanks_page_set', "", $form_no);
    } 
    elseif (!empty($_GET['form_page']) && $_GET['form_page'] === "recaptcha") {
        get_template_part('./functions/mail_form/form_recaptcha_set');
    } 
    //受信履歴 form_reception_history_list
    elseif (isset($_GET['form_reception_history_list']) && $_GET['form_reception_history_list'] != "" && LW_EXPANSION_BASE) {
         $mail_form_reception_history_switch = Lw_theme_mod_set("lw_extensions_mail_form_reception_history_switch", "off");
        if($mail_form_reception_history_switch !== "on") {
            echo '<div class="notice notice-error"><p>受信履歴の保存機能が無効になっています。<br>有効にするには、<a href="' . admin_url('customize.php?autofocus[section]=lw_extensions_sec') . '">カスタマイザー</a>から設定してください。</p></div>';
            return;
        }
        $form_no = hh($_GET['form_reception_history_list']);
        get_template_part('./functions/mail_form/form_reception_history_list', "", $form_no);
    }
    else {
        get_template_part('./functions/mail_form/form_list');
    }
}
