<?php
if ( !defined( 'ABSPATH' ) ) exit;
//ウィジェットアイテムの登録
get_template_part('./functions/widget/item/author');
get_template_part('./functions/widget/item/my_parts');
// ウィジェットエリアの登録
function liteword_register_sidebar() {
    register_sidebar( array(
        'name'          => __( 'サイドバー', 'liteword' ),
        'id'            => 'sidebar_pc',
        'description'   => __( 'サイドバーに表示されるウィジェットエリアです。', 'liteword' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
    // register_sidebar( array(
    //     'name'          => __( '投稿 本文の最後', 'liteword' ),
    //     'id'            => 'post_main_bottom',
    //     'description'   => __( '投稿の本文の最後の部分に表示されるウィジェットエリアです。', 'liteword' ),
    //     'before_widget' => '<div id="%1$s" class="widget %2$s">',
    //     'after_widget'  => '</div>',
    //     'before_title'  => '<h2 class="widget-title">',
    //     'after_title'   => '</h2>',
    // ) );
     register_sidebar( array(
        'name'          => __( '固定ページ（下）', 'liteword' ),
        'id'            => 'page_bottom',
        'description'   => __( '固定ページの下に表示されるウィジェットエリアです。主に「マイパターン」でお使いください。', 'liteword' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
    register_sidebar( array(
        'name'          => __( '投稿 本文の内側（下）', 'liteword' ),
        'id'            => 'post_padding_bottom',
        'description'   => __( '投稿の下に表示されるウィジェットエリアです。', 'liteword' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
    register_sidebar( array(
        'name'          => __( '投稿 本文の外側（下）', 'liteword' ),
        'id'            => 'post_bottom',
        'description'   => __( '投稿の下に表示されるウィジェットエリアです。', 'liteword' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
    register_sidebar( array(
        'name'          => __( 'フッター（上・全幅）', 'liteword' ),
        'id'            => 'footer_widget_area_all',
        'description'   => __( 'フッター上部に全幅表示されるウィジェットエリアです。主に「LWマイパーツ」でお使いください。', 'liteword' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
    register_sidebar( array(
        'name'          => __( 'フッター（上・左）', 'liteword' ),
        'id'            => 'footer_1',
        'description'   => __( 'フッター上部の左側に表示されるウィジェットエリアです。', 'liteword' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );

    register_sidebar( array(
        'name'          => __( 'フッター（上・中央）', 'liteword' ),
        'id'            => 'footer_2',
        'description'   => __( 'フッター上部の中央に表示されるウィジェットエリアです。', 'liteword' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );

    register_sidebar( array(
        'name'          => __( 'フッター（上・右）', 'liteword' ),
        'id'            => 'footer_3',
        'description'   => __( 'フッター上部の右側に表示されるウィジェットエリアです。', 'liteword' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
    register_sidebar( array(
        'name'          => __( 'ドロワーメニュー（下）', 'liteword' ),
        'id'            => 'drawer_bottom',
        'description'   => __( 'スマホメニューの下に表示されるウィジェットです。', 'liteword' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );

}
add_action( 'widgets_init', 'liteword_register_sidebar' );

if(is_admin()){ 
    // 従来のウィジェットエディタを有効にする
    function liteword_disable_block_widgets() {
        remove_theme_support( 'widgets-block-editor' );
    }
    add_action( 'after_setup_theme', 'liteword_disable_block_widgets' );

    function liteword_unregister_widgets() {
        unregister_widget( 'WP_Widget_Calendar' );
        unregister_widget( 'WP_Widget_Meta' );
    }
    add_action( 'widgets_init', 'liteword_unregister_widgets' );
}
// フッター（上・全幅）から「ブロック」ウィジェットを自動削除
function liteword_remove_block_widget_from_footer() {
    // footer_widget_area_all のウィジェットを取得
    $sidebars = wp_get_sidebars_widgets();
    
    if ( isset( $sidebars['footer_widget_area_all'] ) && is_array( $sidebars['footer_widget_area_all'] ) ) {
        $updated = false;
        
        // ブロックウィジェットを探して削除
        foreach ( $sidebars['footer_widget_area_all'] as $key => $widget_id ) {
            // widget_blockで始まるIDを持つウィジェットを削除
            if ( strpos( $widget_id, 'block-' ) === 0 || strpos( $widget_id, 'widget_block' ) === 0 ) {
                unset( $sidebars['footer_widget_area_all'][$key] );
                $updated = true;
            }
        }
        
        // 変更があった場合は保存
        if ( $updated ) {
            // 配列のインデックスをリセット
            $sidebars['footer_widget_area_all'] = array_values( $sidebars['footer_widget_area_all'] );
            wp_set_sidebars_widgets( $sidebars );
        }
    }
}
// widgets_initの後に実行（優先度を20に設定）
add_action( 'widgets_init', 'liteword_remove_block_widget_from_footer', 20 );

// 初回アクセス時や、テーマ切り替え時にも実行
add_action( 'after_switch_theme', 'liteword_remove_block_widget_from_footer' );