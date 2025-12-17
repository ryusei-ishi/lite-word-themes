<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'loading_anime_set_custom' );
function loading_anime_set_custom( $wp_customize ) {
    // -----------------------
    // パネル_パーツスイッチ
    // -----------------------
    $panel = 'loading_anime_panel';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => 'ローディングアニメーション',
            'priority' => 110,
        )
    );
    $set = 'loading_anime'; // 入力ID

    $set_ttl = 'パターンの選択'; 
    $sec = 'loading_anime_sec'; 
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);

    $no_ptn_all = 9;
    if(defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true){
        // プレミアムの場合
        $ptn_no = $no_ptn_all; // パターン数
        $pure_message = '';
    }else{
        // 無料版の場合
        $ptn_no = 1; // パターン数
        $pure_message = '<a href="'.admin_url('index.php?show_premium_popup=1').'" target="_blank">プレミアムプラン</a>の場合は' . $no_ptn_all . '種類利用可能となります。';
    }

    // コントロール
    $items = [
        [
            ['radio', 'ptn_df', '', "<h2 class='ctm_ttl_ptn_1'>全ページ共通</h2>$pure_message", lw_ptn_arr("未選択",$ptn_no)],
            ['radio', 'ptn_page', '','<h2 class="ctm_ttl_ptn_1">固定ページ共通</h2>',  lw_ptn_arr("未選択",$ptn_no)],
            ['radio', 'ptn_post', '','<h2 class="ctm_ttl_ptn_1">投稿ページ共通</h2>',  lw_ptn_arr("未選択",$ptn_no)],
            ['radio', 'ptn_archive','', '<h2 class="ctm_ttl_ptn_1">アーカイブページ共通</h2>',  lw_ptn_arr("未選択",$ptn_no)],
        ]
    ];
    
    customize_set($items, $set, $sec, $wp_customize);    
}