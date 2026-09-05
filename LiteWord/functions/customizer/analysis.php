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

    // -----------------------
    // 広告リンクのクリック計測
    // -----------------------
    // rel="sponsored" が付いたリンク（＝広告リンク）が押されたときに、
    // アナリティクスへ affiliate_click というイベントを送る。
    // 送るのは URL・ドメイン・リンクの文字だけ。個人を特定するものは送らない。
    // 上のIDが両方とも空のときは、送り先が無いので何も出力しない。
    $sec2 = 'seo_set_affiliate_click_sec';
    $wp_customize->add_section($sec2, [
        'title' => '広告リンクのクリック計測',
        'panel' => $panel,
        'description' => 'アフィリエイトのリンクが押された回数を、Googleアナリティクスで見られるようにします。イベント名は affiliate_click で、どのリンクが・どのお店へ押されたかが分かります。上の「Google関係」でIDを入れていないと動きません。',
    ]);
    $items2 = [
        [
            ['radio', 'affiliate_click_switch', '', '', [
                "on" => '計測する',
                "off" => '計測しない',
            ]],
        ]
    ];
    customize_set($items2, $set, $sec2, $wp_customize);
}