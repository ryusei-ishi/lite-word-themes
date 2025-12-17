<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'archive_page_custom' );
function archive_page_custom( $wp_customize ) {
    
    // -----------------------
    // パネル_パーツスイッチ
    // -----------------------
    $panel = 'archive_page';
    $wp_customize->add_panel(
        $panel, // パネルID
        array(
            'title'    => 'デザイン設定 - アーカイブページ',
            'priority' => 120,
        )
    );
    // -----------------------
    // パターンの選択
    // -----------------------
    if ( defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION ) {
        // プレミアムプランの場合
        $fv_ptn_arr = [
            '' => '未選択',
            'ptn_none' => '非表示',
            'ptn_1' => 'パターン1（デフォルト）',
            'ptn_2' => 'パターン2',
            'ptn_3' => 'パターン3',
            'ptn_4' => 'パターン4（プレミアム限定）',
        ];
    }else{
        // 無料プランの場合
        $fv_ptn_arr = [
            '' => '未選択',
            'ptn_none' => '非表示',
            'ptn_1' => 'パターン1（デフォルト）',
            'ptn_2' => 'パターン2',
            'ptn_3' => 'パターン3',
            'ptn_4_invalid' => 'パターン4（プレミアム限定）',
        ];
    }
    $pst_list_ptn_arr = [
        '' => '未選択',
        'ptn_1' => 'パターン1（デフォルト）',
        'ptn_2' => 'パターン2',
        'ptn_3' => 'パターン3（お知らせ一覧用）',
        'ptn_4' => 'パターン4',
       
    ];
    $set_ttl = 'パターンの選択'; // セクションタイトル
    $sec = 'archive_page_ptn_sec'; // セクションID
    $set = 'archive_page_layout'; // 入力ID
    $wp_customize->add_section($sec, ['title' => $set_ttl, 'panel' => $panel]);
    // コントロール
    $items = [
        [
            ['radio', 'fv_ptn_df', '', '<h2 class="ctm_ttl_ptn_1">ファーストビュー（共通設定）</h2>', $fv_ptn_arr],
            ['color', 'fv_df_bg_color','', '背景色'],
            ['color', 'fv_df_text_color','', '文字の色'],
            ['select', 'fv_df_font','', 'デフォルトフォント', ctm_font_family_arr()],
            ['select', 'fv_df_font_weight', '', 'デフォルト文字太さ', ctm_font_weight_arr()],
            ['img', 'fv_df_image', 'デフォルト画像', 'カテゴリーのアイキャッチは<a href="'.admin_url().'edit-tags.php?taxonomy=category" target="_blank" rel="noopener noreferrer">カテゴリーの設定</a>で変更できます。'],
            ['color', 'fv_df_image_filter_color','', '画像の上のフィルターの色'],
            ['range', 'fv_df_image_filter_op','', '画像の上のフィルターの透明度'],
            ['radio', 'post_list_ptn_df', '', '<h2 class="ctm_ttl_ptn_1">投稿一覧（共通設定）</h2>', $pst_list_ptn_arr],
            ['img', 'post_list_df_image', 'デフォルト画像', ''],
        ]
    ];
    customize_set($items, $set, $sec, $wp_customize);   

}