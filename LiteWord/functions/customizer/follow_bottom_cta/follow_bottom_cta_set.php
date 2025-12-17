<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_set_custom' );
function follow_bottom_cta_set_custom( $wp_customize ) {
    
    // パネル設定
    $panel = 'follow_bottom_cta_set';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => 'ページ下の追従CTAボタン', // パネルタイトル
            'priority' => 120,
        )
    );
    // 入力ID（共通）
    $set = 'follow_bottom_cta_set'; 

    // パターンの選択
    $set_ttl = 'パターンの選択'; 
    $sec = 'follow_bottom_cta_set_ptn_sec'; 
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    $items = [
        [
            ['radio', 'ptn_df', '', '<h2 class="ctm_ttl_ptn_1" >全ページ共通</h2>', follow_bottom_cta_arr()],
            ['radio', 'ptn_page', '', '<h2 class="ctm_ttl_ptn_1" >固定ページ</h2>', follow_bottom_cta_arr()],
            ['radio', 'ptn_post', '', '<h2 class="ctm_ttl_ptn_1" >投稿ページ</h2>', follow_bottom_cta_arr()],
            ['radio', 'ptn_archive', '', '<h2 class="ctm_ttl_ptn_1" >アーカイブページ</h2>', follow_bottom_cta_arr()],
        ]
    ];
    
    customize_set($items, $set, $sec, $wp_customize);    
}