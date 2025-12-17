<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'seo_set_custom' );
function seo_set_custom( $wp_customize ) {
    
    // -----------------------
    // パネル_パーツスイッチ
    // -----------------------
    $panel = 'seo_set';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => '分析関係の設定',
            'priority' => 200,
        )
    );

     // -----------------------
    // Google関係
    // -----------------------
    $set_ttl = 'Google関係'; // セクションタイトル
    $sec = 'seo_set_google_sec'; // セクションID
    $set = 'seo_set'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);

    // コントロール
    $items = [
        [
            ['text', 'google_analytics_id', 'アナリティクス ID', '例）G-XXXXXXXXX  ', ],
            ['text', 'gtm_id', 'タグマネージャー ID', '例）GTM-XXXXXXX', ],
            ['radio', 'admin_switch', 'ログインしている場合', '管理者・編集者はアクセス解析を無効にしますか？', [
                "on" => '有効にする',
                "off" => '無効にする',
            ]],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);    
}