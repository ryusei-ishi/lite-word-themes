<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'archive_ptn_short_code_set_custom' );
function archive_ptn_short_code_set_custom( $wp_customize ) {
    $panel = 'archive_page';
    $set = 'archive_ptn_short_code_set';
    // 設定
    $set_ttl = ' - ショートコードの設定'; // セクションタイトル
    $sec = 'archive_ptn_short_code_sec'; // セクションID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    //セット
    $items = [
        [
            ['text', 'fv_put', '', '<h2 class="ctm_ttl_ptn_1">ファーストビュー</h2>パターンの選択で「ショートコード」を選んだ時に表示されます。'],
            ['text', 'post_list_put', '', '<h2 class="ctm_ttl_ptn_1">投稿一覧</h2>パターンの選択で「ショートコード」を選んだ時に表示されます。'],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);
}
