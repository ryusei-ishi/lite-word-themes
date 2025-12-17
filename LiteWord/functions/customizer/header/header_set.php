<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'header_set_custom' );
function header_set_custom( $wp_customize ) {
    
    // -----------------------
    // パネル_パーツスイッチ
    // -----------------------
    $panel = 'header_set';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => 'デザイン設定 - ヘッダー',
            'priority' => 115,
        )
    );
    $set = 'header_set'; // 入力ID


    // -----------------------
    // パターンの選択
    // -----------------------
    $set_ttl = 'パターンの選択'; 
    $sec = 'header_set_ptn_sec'; 
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $items = [
        [
            ['radio', 'ptn_df', '', '<h2 class="ctm_ttl_ptn_1">全ページ共通</h2>', header_ptn_arr()],
            ['radio', 'ptn_page', '','<h2 class="ctm_ttl_ptn_1">固定ページ共通</h2>',  header_ptn_arr()],
            ['radio', 'ptn_post', '','<h2 class="ctm_ttl_ptn_1">投稿ページ共通</h2>',  header_ptn_arr()],
            ['radio', 'ptn_archive','', '<h2 class="ctm_ttl_ptn_1">アーカイブページ共通</h2>',  header_ptn_arr()],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);     
}