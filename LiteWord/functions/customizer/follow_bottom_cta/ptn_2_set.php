<?php
if ( !defined( 'ABSPATH' ) ) exit;
add_action( 'customize_register', 'follow_bottom_cta_ptn_2_set_custom' );
function follow_bottom_cta_ptn_2_set_custom( $wp_customize ) {
    $panel = 'follow_bottom_cta_set';
    $set = 'follow_bottom_cta_ptn_2_set'; 
    // 設定
    $set_ttl = ' - パターン２の設定'; // セクションタイトル
    $sec = 'follow_bottom_cta_ptn_2_sec'; // セクションID
    $wp_customize->add_section($sec, [
        'title' => $set_ttl,
        'panel' => $panel,
        'description' => lw_follow_bottom_cta_preview_description('ptn_2'),
        'description_hidden' => false,
    ]);
    // 電話番号・スマホのボタンのフォント（2026-10-06 追加）。
    // 既定は今までテンプレートに直書きしていた Lato のまま（未設定＝Lato）。
    // 🚨 Lw_theme_mod_set() は値が空だと既定値を返すので、空を「指定なし」にすると Lato に戻って外せない。
    //    空は「Lato（初期設定）」、指定なしは 'inherit' で持つ（テンプレート側で属性を出さない）。
    $lw_ptn2_font_choices = [
        ''        => 'Lato（初期設定）',
        'inherit' => 'フォントの指定なし（サイト全体の設定に合わせる）',
    ] + ctm_font_family_arr();
    $items = [];
    $items[] =  [
        ["text" , "logo_text","",'<h2 class="ctm_ttl_ptn_1">PC時のデザイン設定</h2><h3 class="ctm_ttl_ptn_2">ロゴ部分 1</h3>テキストの場合'],
        ["select" , "font_family","",'フォントの種類',ctm_font_family_arr()],
        ["select", "font_weight","","フォントの太さ",ctm_font_weight_arr()],
        ["img", "logo_img", "", "ロゴ画像の場合"],
        ["select","logo_url","","ロゴのURL",
            [
                "home_page"=>"トップページを指定する",
                "this_page"=>"アクセス中のページをURL指定するとして指定する",
                "no_link"=>"リンクを無効にする",
            ]
        ],
        ["text" , "point_text_1","",'<h3 class="ctm_ttl_ptn_2">ポイント部分</h3>'],
        ["color", "point_text_1_color_bg","",''],
        ["text" , "point_text_2","",''],
        ["color", "point_text_2_color_bg","",''],
        ["text" , "point_text_3","",''],
        ["color", "point_text_3_color_bg","",''],
        ["text" , "point_text_4","",''],
        ["color", "point_text_4_color_bg","",''],
        ["text" , "tel","",'<h3 class="ctm_ttl_ptn_2">電話番号</h3>'],
        ["color" , "tel_color"],
        ["select", "tel_font_family", "", "電話番号のフォント", $lw_ptn2_font_choices],
        ["textarea" , "btn_text","",'<h3 class="ctm_ttl_ptn_2">ボタン部分</h3>表示テキスト'],
        ["text" , "btn_url","",'リンク先URL'],
        ["color" ,"btn_color_bg" ,""],
        ["text" , "sp_btn_1_text_sub","",'<h2 class="ctm_ttl_ptn_1">スマホ時のデザイン設定</h2><h3 class="ctm_ttl_ptn_2">ボタン１</h3>表示テキスト'],
        ["text" , "sp_btn_1_text_main","",''],
        ["text" , "sp_btn_1_url","",'リンク先URL<br>※電話の場合（例）tel:000-0000-0000<br>※URLの場合（例）https://sample.com'],
        ["color" , "sp_btn_1_color_bg"],
        ["range" , "sp_btn_1_border_radius","","角丸の加減"],
        ["text" , "sp_btn_2_text_sub","",'<h3 class="ctm_ttl_ptn_2">ボタン２</h3>表示テキスト'],
        ["text" , "sp_btn_2_text_main","",''],
        ["text" , "sp_btn_2_url","",'リンク先URL<br>※電話の場合（例）tel:000-0000-0000<br>※URLの場合（例）https://sample.com'],
        ["color" , "sp_btn_2_color_bg"],
        ["range" , "sp_btn_2_border_radius","","角丸の加減"],
        ["select", "sp_btn_font_family", "", '<h3 class="ctm_ttl_ptn_2">ボタンのフォント</h3>ボタン１・２共通', $lw_ptn2_font_choices],
    ];
    customize_set($items, $set, $sec, $wp_customize);    
}


