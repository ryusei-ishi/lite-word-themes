<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_ptn_11_set_custom' );
function follow_bottom_cta_ptn_11_set_custom( $wp_customize ) {
    $panel = 'follow_bottom_cta_set';
    $set = 'follow_bottom_cta_ptn_11_set';
    $set_ttl = ' - パターン１１の設定';
    $sec = 'follow_bottom_cta_ptn_11_sec';
    $wp_customize->add_section($sec, [
        'title' => $set_ttl,
        'panel' => $panel,
        'description' => lw_follow_bottom_cta_preview_description('ptn_11'),
        'description_hidden' => false,
    ]);
    $items = [];
    $items[] = [
        ['text', "label_text", "", '<h2 class="ctm_ttl_ptn_1">テキストの設定</h2>見出しテキスト'],
        ['text', "placeholder_text", "", '入力欄のプレースホルダー'],
    ];
    $items[] = [
        ['text', "btn_text", "", '<h2 class="ctm_ttl_ptn_1">送信先の設定</h2>ボタンの表示テキスト'],
        ['email', "notify_email", "", '通知を受け取るメールアドレス（空欄なら管理者メール宛に届きます）。届いたメールの一覧は「Lwお問い合わせ」→「追従CTAリード」からも確認できます。'],
        ['text', "btn_link", "", '送信完了後に移動する先のURL（任意・空欄なら画面に完了メッセージを表示します）'],
        ['color', "color_btn", "", 'ボタンの背景色'],
    ];
    $items[] =  [
        ["radio" , "responsive_switch","",'<h2 class="ctm_ttl_ptn_1">レスポンシブ設定</h2>表示デバイス',[
            'sp_pc' => 'スマホとPCの両方で表示',
            'sp_only' => 'スマホの時のみ表示',
            'pc_only' => 'PCの時のみ表示',
        ]],
    ];
    customize_set($items, $set, $sec, $wp_customize);
}
