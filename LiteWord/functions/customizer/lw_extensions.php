<?php
if ( !defined( 'ABSPATH' ) ) exit;

add_action( 'customize_register', 'extensions_custom' );
function extensions_custom( $wp_customize ) {
    $set_ttl = '拡張機能設定'; 
    $sec = 'lw_extensions_sec'; 
    $set = 'lw_extensions'; 
    $wp_customize->add_section($sec, [
        'title'    => $set_ttl,
        'priority' => 205, 
    ]);
    // コントロール
    $items = [
        [
            //問合せフォーム関係
            ['select', 'mail_form_switch_all','', '<h2 class="ctm_ttl_ptn_1">お問合わせフォーム関係</h2>メールフォーム機能全般',ctm_switch_array()],
            ['select', 'mail_form_thanks_mail_switch','', 'サンクスメール機能',ctm_switch_array()],
            ['select', 'mail_form_reception_history_switch','', '受信履歴の保存機能',ctm_switch_array()],
            //アニメーション関連
            ['select', 'animation_switch','', '<h2 class="ctm_ttl_ptn_1" style="margin-top:16px;">アニメーション機能</h2>',ctm_switch_array()],
            //SEO対策関係
            ['select', 'seo_functions_switch','', '<h2 class="ctm_ttl_ptn_1">SEO関係</h2>', ctm_switch_array()],
            //投稿下のコメント機能
            ['select', 'comment_functions_switch','', '<h2 class="ctm_ttl_ptn_1">投稿下のコメント機能</h2>', ctm_switch_array()],
            //ユーザープロフィール設定
            ['select', 'profile_manager_functions_switch','', '<h2 class="ctm_ttl_ptn_1">ユーザープロフィール管理</h2>ユーザープロフィールの管理画面を有効化します。',ctm_switch_array()],
            //通知関係
            ['select', 'notification_paid_features','', '<h2 class="ctm_ttl_ptn_1">LiteWord通知関係</h2>有料機能・無料体験オファー',ctm_switch_array()],

        ]
    ];
    
    customize_set($items, $set, $sec, $wp_customize);    
}