<?php
if (!defined('ABSPATH')) exit;
// インプット用関数
function customize_set($items, $set, $sec = "", $wp_customize = "") {
    if (is_customize_preview()) {
        foreach ($items as $controls) {
            foreach ($controls as $control) {
                // コントロールID
                $set_in      = $set . '_' . $control[1];
                $label       = !empty($control[2]) ? $control[2] : "";
                $description = !empty($control[3]) ? $control[3] : "";

                // ----------------------------------------
                // 共通の Setting を追加（必要なら sanitize_callback を入れる）
                // ----------------------------------------
                $wp_customize->add_setting( $set_in );

                // ----------------------------------------
                // Control の種類ごとに分岐
                // ----------------------------------------
                switch ( $control[0] ) {
                    /* ───────── テキスト系・標準HTML5入力タイプ ───────── */
                    case 'text':
                    case 'textarea':
                    case 'select':
                    case 'radio':
                    case 'range':
                    case 'date':
                    case 'email':
                    case 'tel':
                    case 'search':
                    case 'password':
                    case 'url':
                    case 'number':
                    case 'time':
                        $control_type = $control[0];
                        $choices      = isset( $control[4] ) ? $control[4] : [];
                        
                        // number と range の場合は追加の属性を設定可能
                        $input_attrs = [];
                        if ( in_array( $control_type, ['number', 'range'] ) ) {
                            // 第5引数に min, 第6引数に max, 第7引数に step を設定可能
                            if ( isset( $control[5] ) ) $input_attrs['min'] = $control[5];
                            if ( isset( $control[6] ) ) $input_attrs['max'] = $control[6];
                            if ( isset( $control[7] ) ) $input_attrs['step'] = $control[7];
                        }
                        
                        add_custom_control(
                            $wp_customize,
                            $set_in,
                            $sec,
                            $label,
                            $description,
                            $control_type,
                            $choices,
                            $input_attrs
                        );
                        break;

                    /* ───────── 画像アップロード ───────── */
                    case 'img':
                        $wp_customize->add_control(
                            new WP_Customize_Image_Control(
                                $wp_customize,
                                $set_in,
                                [
                                    'section'     => $sec,
                                    'settings'    => $set_in,
                                    'label'       => $label,
                                    'description' => $description,
                                ]
                            )
                        );
                        break;

                    /* ───────── カラーピッカー ───────── */
                    case 'color':
                        $wp_customize->add_control(
                            new WP_Customize_Color_Control(
                                $wp_customize,
                                $set_in,
                                [
                                    'section'     => $sec,
                                    'settings'    => $set_in,
                                    'label'       => $label,
                                    'description' => $description,
                                ]
                            )
                        );
                        break;

                    /* ───────── コードエディタ ───────── */
                    case 'code':
                        $wp_customize->add_control(
                            new WP_Customize_Code_Editor_Control(
                                $wp_customize,
                                $set_in,
                                [
                                    'section'     => $sec,
                                    'settings'    => $set_in,
                                    'label'       => $label,
                                    'description' => $description,
                                ]
                            )
                        );
                        break;
                }
            }
        }
    }
}


function add_custom_control($wp_customize, $set_in, $sec, $label, $description, $type, $choices = [], $input_attrs = []) {
    $control_settings = [
        'section' => $sec,
        'settings' => $set_in,
        'label' => $label,
        'description' => $description,
        'type' => $type,
    ];

    // choicesが必要なタイプの場合のみ追加
    if (!empty($choices)) {
        $control_settings['choices'] = $choices;
    }

    // input_attrsが設定されている場合は追加（number, rangeなど用）
    if (!empty($input_attrs)) {
        $control_settings['input_attrs'] = $input_attrs;
    }

    $wp_customize->add_control(new WP_Customize_Control($wp_customize, $set_in, $control_settings));
}
//最大幅
function ctm_max_width_arr() {
    $options = [];
    $number = 1440;
    $options = $options + array("" => "未選択"); 
    $options = $options + array("100%" => "横幅100%");
    // 既存のループでピクセル単位のmax-widthを追加
    for ($i = 0; $i < 100; $i++) { 
        $options = $options + array("$number"."px" => $number."px"); 
        $number = $number - 8;
    }
    return $options;
}
// カスタマイザーselect_arr
function ctm_switch_array($df_text="未選択"){
    return [
        "" => "$df_text",
        "on" => "ON",
        "off" => "OFF",
    ];
}

function ctm_switch_array_2(){
    return [
        "on" => "表示する",
        "off" => "表示しない",
    ];
}
//シンプルにパターンのみ
function lw_ptn_arr($df_text="未選択", $max=2){
    $ptn_arr = [
        "" => "$df_text",
    ];
    $ptn_arr["none"] = "非表示";
    for ($i=1; $i <= $max; $i++) { 
        $ptn_arr["ptn_{$i}"] = "パターン{$i}";
    }
    return $ptn_arr;
}

//ヘッダー
function header_ptn_arr() {
    $header_ptn = [];

    $header_ptn['']       = '未選択';
    $header_ptn['ptn_1']  = 'ヘッダーパターン1（デフォルト）';
    $header_ptn['ptn_2']  = 'ヘッダーパターン2';
    $header_ptn['ptn_3']  = 'ヘッダーパターン3';

    if (templateSettingCheck("shin_gas_station_01") || templateSettingCheck("template_001")) {
        $header_ptn['ptn_4'] = 'ヘッダーパターン4';
    }

    $header_ptn['ptn_5'] = 'ヘッダーパターン5';
    $header_ptn['ptn_6'] = 'ヘッダーパターン6';
    $header_ptn['none']  = '非表示';

    return $header_ptn;
}
function drawer_ptn_arr(){
    $drawer_ptn_arr = [
        '' => '未選択',
        'ptn_1' => 'ドロワーパターン1（デフォルト）',
        'none' => '非表示',
    ];
    return $drawer_ptn_arr;
}
function footer_ptn_arr() {
    $footer_ptn = [];

    $footer_ptn['']       = '未選択';
    $footer_ptn['ptn_1']  = 'フッターパターン1（デフォルト）';
    $footer_ptn['ptn_2']  = 'フッターパターン2';
    if (templateSettingCheck("shin_gas_station_01") || templateSettingCheck("template_001")) {
        $footer_ptn['ptn_3']  = 'フッターパターン3';
    }
    $footer_ptn['ptn_4']  = 'フッターパターン4';
    $footer_ptn['none']   = '非表示';

    return $footer_ptn;
}

function follow_bottom_cta_arr(){
    return $follow_bottom_cta_arr = [
        '' => '未選択',
        'ptn_1' => '追従CTAパターン1',
        'ptn_2' => '追従CTAパターン2',
        'none' => '非表示',
    ];
}
function ctm_heading_arr(){
    $heading_arr = [
        '' => '未指定',
        'normal' => '通常',
        'bold' => '太字',
        'underline' => '下線',
        'underline_dotted' => '下線（点線）',
        'underline_dashed' => '下線（破線）',
        'underline_double' => '下線（二重線）',
        'left_line_thick' => '左線（太い）',
        'left_line_thin' => '左線（細い）',
        'border' => '囲み線',
        'border_round' => '囲み線（角丸）',
        'border_dashed' => '囲み破線',
        'border_dashed_round' => '囲み破線（角丸）',
        'border_double' => '囲み二重線',
        'border_double_round' => '囲み二重線（角丸）',
        'top_bottom_line' => '上下線',
        'top_bottom_line_dotted' => '上下線（点線）',
        'top_bottom_line_dashed' => '上下線（破線）',
        'top_bottom_line_double' => '上下線（二重線）',
        'bg_color' => '背景色',
        'bg_color_transparency' => '背景色（透過）',
        'bg_color_transparency_left_line_thick' => '背景色（透過）+ 左線（太い）',
        'left_square_s' => '左角四角（小）',
        'left_square_l' => '左角四角（大）',
    ];
    return $heading_arr;
}
function ctm_sns_icon_arr(){
    $sns_icon_arr = [
        '' => '未選択',
        'none' => '表示しない',
        'note' => 'note',
        'threads' => 'Threads',
        'facebook' => 'facebook',
        'x' => 'x（旧Twitter）',
        'instagram' => 'instagram',
        'line' => 'line',
        'youtube' => 'youtube',
        'mail' => 'mail',
    ];
    return $sns_icon_arr;
}
function ctm_cta_icon_arr(){
    $sns_icon_arr = [
        '' => '未選択',
        'none' => '表示しない',
        'mail' => 'mail',
        'tel' => 'tel',
        'pc' => 'pc',
        'download_1' => 'ダウンロード',
        'facebook' => 'facebook',
        'x' => 'x（旧Twitter）',
        'instagram' => 'Instagram',
        'line' => 'LINE',
        'youtube' => 'YouTube',
        'doctor' => '医者',
        'user' => 'ユーザー',
        'turn-up'=>'アップ',
        'coins'=>'コイン',
        'comment'=>'コメント 01',
        'comments'=>'コメント 02',
        'comment-dots'=>'コメント 03',
        'message'=>'コメント 04',
    ];
    return $sns_icon_arr;
}
function ctm_tel_icon_arr(){
    $sns_icon_arr = [
        '' => '未選択',
        'none' => '表示しない',
        'tel' => 'tel 1',
        'tel_2' => 'tel 2',
        'tel_3' => 'tel 3',
        'tel_4' => 'tel 4',
        'tel_5' => 'tel 5',
        'tel_6' => 'tel 6',
        'tel_7' => 'tel 7',
        'tel_8' => 'tel 8',
       
    ];
    return $sns_icon_arr;
}
/**
 * SNSアイコンのセレクト用配列
 * 必要そうなサービスをすべて網羅し、ラベルも日本語で統一
 */
function ctm_sns_share_icon_arr() {
	$sns_icon_arr = [
        '' => '未選択',
        'none' => '表示しない',
		// 主要SNS
		'facebook'  => 'Facebook',
		'x'         => 'X（旧Twitter）',
		'line'      => 'LINE',
		
		// 情報収集・共有サービス
		'pocket'    => 'Pocket',
		'hatena'    => 'はてなブックマーク',
		'linkedin'  => 'LinkedIn',
		'reddit'    => 'Reddit',
		'pinterest' => 'Pinterest',
		'tumblr'    => 'Tumblr',
		
		// メッセンジャー系
		'telegram'  => 'Telegram',
		'whatsapp'  => 'WhatsApp',
		'mastodon'  => 'Mastodon',

		// ユーティリティ
		'mail'     => 'Email',
		'copy'      => 'URLコピー',
	];
	return $sns_icon_arr;
}

function ctm_font_family_arr(){
    // 日本語フォント（無料）
    $lw_font_ja_free = [
        '' => 'フォントの指定なし',
        'gothic' => 'ゴシック体（システムフォント）',
        'mincho' => '明朝体（システムフォント）',
        
        // ゴシック系
        'Noto Sans JP' => 'ゴシック | Noto Sans JP（一番おススメ）',
        'Zen Kaku Gothic New' => 'ゴシック | Zen Kaku Gothic New',
        'Sawarabi Gothic' => 'ゴシック | Sawarabi Gothic',
        'Murecho' => 'ゴシック | Murecho',
        'IBM Plex Sans JP' => 'ゴシック | IBM Plex Sans JP',
        'BIZ UDPGothic' => 'ゴシック | BIZ UDPGothic',
        
        // 明朝系
        'Noto Serif JP' => '明朝 | Noto Serif JP',
        'Sawarabi Mincho' => '明朝 | Sawarabi Mincho',
        
        // 丸ゴシック系
        'M PLUS Rounded 1c' => '丸ゴシック | M PLUS Rounded 1c',
        'Kosugi Maru' => '丸ゴシック | Kosugi Maru',
    ];
    
    // 日本語フォント（プレミアム）
    $lw_font_ja_premium = [];
    
    if(defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true){
        $lw_font_ja_premium = [
            // ゴシック系
            'Zen Maru Gothic' => '丸ゴシック | Zen Maru Gothic',
            'Dela Gothic One' => '太ゴシック | Dela Gothic One',
            'Zen Kaku Gothic Antique' => 'アンティークゴシック | Zen Kaku Gothic Antique',
            'DotGothic16' => 'ドットゴシック | DotGothic16',
            'RocknRoll One' => 'ポップゴシック | RocknRoll One',
            
            // 明朝系
            'Shippori Mincho' => '明朝 | Shippori Mincho',
            'Shippori Mincho B1' => '明朝 | Shippori Mincho B1',
            'Hina Mincho' => '明朝 | Hina Mincho',
            'Zen Old Mincho' => '古風明朝 | Zen Old Mincho',
            'Yuji Mai' => '筆明朝 | Yuji Mai',
            'Yuji Syuku' => '筆明朝 | Yuji Syuku',
            'Zen Kurenaido' => '装飾明朝 | Zen Kurenaido',
            'Zen Antique' => 'アンティーク明朝 | Zen Antique',
            'New Tegomin' => '教科書体 | New Tegomin',
            
            // デザイン系
            'WDXL Lubrifont JP N' => 'デザイン | WDXL Lubrifont JP N',
            'Kaisei Decol' => '装飾 | Kaisei Decol',
            'Potta One' => 'ポップ | Potta One',
            'Hachi Maru Pop' => 'ポップ | Hachi Maru Pop',
            'Rampart One' => '立体 | Rampart One',
            'Stick' => 'スティック | Stick',
            
            // 手書き風
            'Yusei Magic' => '手書き風 | Yusei Magic',
            'Klee One' => '手書き風 | Klee One',
            'Mochiy Pop P One' => '手書きポップ | Mochiy Pop P One',
        ];
    }
    
    // 英語フォント（無料）
    $lw_font_en_free = [
        // サンセリフ系
        'Roboto' => '英数字 | サンセリフ | Roboto',
        'Lato' => '英数字 | サンセリフ | Lato',
        'Montserrat' => '英数字 | サンセリフ | Montserrat',
        'Sora' => '英数字 | サンセリフ | Sora',
        'Josefin Sans' => '英数字 | サンセリフ | Josefin Sans',
        'Open Sans' => '英数字 | サンセリフ | Open Sans',
        'Raleway' => '英数字 | サンセリフ | Raleway',
        
        // デザイン系
        'Coming Soon' => '英数字 | 手書き風 | Coming Soon',
        'Lacquer' => '英数字 | 装飾 | Lacquer',
        'Abril Fatface' => '英数字 | ディスプレイ | Abril Fatface',
        
        // スクリプト系
        'Lavishly Yours' => '英数字 | 筆記体 | Lavishly Yours',
        'Sacramento' => '英数字 | 筆記体 | Sacramento',
        'Hurricane' => '英数字 | 筆記体 | Hurricane',
        'Dancing Script' => '英数字 | 筆記体 | Dancing Script',
    ];

    // 全フォントをマージ
    $font_family_arr = array_merge($lw_font_ja_free, $lw_font_ja_premium, $lw_font_en_free);
    
    // 種類別にソートする処理
    $sorted_fonts = [];
    $special_items = []; // システムフォントや特殊項目
    $categorized = [];    // カテゴリー別に分類
    
    foreach ($font_family_arr as $key => $value) {
        // 特殊項目（システムフォントや空値）は最初に配置
        if ($key === '' || strpos($value, '（システムフォント）') !== false) {
            $special_items[$key] = $value;
        } 
        // カテゴリー付きのフォント
        else if (strpos($value, '|') !== false) {
            $parts = explode('|', $value);
            $category = trim($parts[0]);
            $categorized[$category][$key] = $value;
        }
        // その他
        else {
            $categorized['その他'][$key] = $value;
        }
    }
    
    // カテゴリーの表示順序を定義
    $category_order = [
        // 日本語系
        'ゴシック', '明朝', '丸ゴシック', '太ゴシック', 
        'アンティークゴシック', 'ドットゴシック', 'ポップゴシック',
        '古風明朝', '筆明朝', '装飾明朝', 'アンティーク明朝', 
        '教科書体', 'デザイン', '装飾', 'ポップ', '立体', 
        'スティック', '手書き風', '手書きポップ',
        // 英語系
        '英数字',
        // その他
        'その他'
    ];
    
    // 順序に従って結果を構築
    $sorted_fonts = $special_items; // まずシステムフォントを追加
    
    foreach ($category_order as $category) {
        if (isset($categorized[$category])) {
            // 各カテゴリー内でアルファベット順にソート
            asort($categorized[$category]);
            $sorted_fonts = array_merge($sorted_fonts, $categorized[$category]);
        }
    }
    
    return $sorted_fonts;
}
//jsに配列を渡す
add_action('admin_enqueue_scripts', function() {
    if (!get_current_screen()?->is_block_editor()) return;
    
    $fonts = ctm_font_family_arr();
    $options = [];
    foreach ($fonts as $value => $label) {
        $options[] = compact('label', 'value');
    }
    
    wp_localize_script('wp-blocks', 'lwFontSettings', [
        'fontFamilyOptions' => $options
    ]);
});
function ctm_font_weight_arr(){
    $font_weight_arr = [
        '' => 'フォントの太さ指定なし',
        '100' => '100',
        '200' => '200',
        '300' => '300',
        '400' => '400',
        '500' => '500',
        '600' => '600',
        '700' => '700',
        '800' => '800',
        '900' => '900',
    ];
    return $font_weight_arr;
}
function ctm_font_size_arr(){
    $font_size_arr = [
        '' => '指定なし',
        '12px' => '12px',
        '13px' => '13px',
        '14px' => '14px',
        '15px' => '15px',
        '16px' => '16px',
        '17px' => '17px',
        '18px' => '18px',
        '19px' => '19px',
        '20px' => '20px',
    ];
    return  $font_size_arr;
}
function ctm_menu_arr() {
    // 取得する配列を初期化
    $item_arr = [
        '' => '未選択',
    ];

    // 現在登録されているすべてのナビゲーションメニューを取得
    $menus = wp_get_nav_menus();

    // 取得したメニューをループして、スラッグとメニュー名の配列を生成
    foreach ( $menus as $menu ) {
        $item_arr[$menu->name] = $menu->name;
    }

    return $item_arr;
}
//ctm_header_follow_switch_arr
if(is_customize_preview()){
    function ctm_header_follow_switch_arr(){
        $item_arr = [
            ['radio', 'follow_switch','', '<h2 class="ctm_ttl_ptn_1">ヘッダー追従切替</h2>' , [
                'off' => '追従させない',
                'on' => '追従させる',
                'on_pc_menu_1' => '追従させる（PCの時はメニューのみ追従）',
            ]],
        ];
        return $item_arr;
    }
}
//information_bar_custom_arr
if(is_customize_preview()){
    function ctm_information_bar_custom_arr(){
        $logo_item = [
            ['radio', 'information_bar_switch','', '<h2 class="ctm_ttl_ptn_1">インフォメーションバー部分</h2>' , ctm_switch_array_2()],
            ['text', 'information_bar_text', '', '表示するテキスト'],
            ['text', 'information_bar_url', '', 'url（リンクにする場合）'],
            ['color', 'information_bar_bg_color', '', '背景色'],
            ['color', 'information_bar_text_color', '', 'テキスト色'],
            ['select', 'information_bar_font', '', 'フォントの指定' , ctm_font_family_arr()],

        ];
        return $logo_item;
    }
}
function lw_information_bar_put($item = []){
    // デフォルト値の設定
    $defaults = [
        "location" => "header",
        "ptn" => "ptn_1",
        "df_switch" => "on",
        "df_text" => get_bloginfo('description'),
        "df_text_color" => "#ffffff",
        "df_bg_color" => "var(-color-main)",
        "df_text_font" => "",
    ];
    // $item と $defaults をマージし、$item にないキーにはデフォルト値を使用
    $item = array_merge($defaults, $item);
    //代入
    $location = $item["location"];
    $ptn = $item["ptn"];
    $class = ".{$location}_{$ptn}";
    $set_id = "{$location}_{$ptn}_set";
    $df_text = Lw_theme_mod_set("{$set_id}_information_bar_text",$item["df_text"]);
    $df_switch = Lw_theme_mod_set("{$set_id}_information_bar_switch",$item["df_switch"]);
    $df_text_color = Lw_theme_mod_set("{$set_id}_information_bar_text_color",$item["df_text_color"]);
    $df_bg_color = Lw_theme_mod_set("{$set_id}_information_bar_bg_color",$item["df_bg_color"]);
    $df_text_font = Lw_theme_mod_set("{$set_id}_information_bar_font",$item["df_text_font"]);
    $url = Lw_theme_mod_set("{$set_id}_information_bar_url","");
    ?>
        <?php 
        if (!empty($df_text) && $df_switch !== "off"): 
            if(!empty($url)):?>
            <a href="<?=$url?>" class="lw_information_bar" itemprop="description" style="color:<?=$df_text_color?>; background:<?=$df_bg_color?>;">
                <p data-lw_font_set="<?=$df_text_font?>"><?=$df_text?></p>
            </a>
        <?php else: ?>
            <div class="lw_information_bar" itemprop="description" style="color:<?=$df_text_color?>; background:<?=$df_bg_color?>;">
                <p data-lw_font_set="<?=$df_text_font?>"><?=$df_text?></p>
            </div>
        <?php endif; endif;?>
    <?php
}
//logo_custom_arr
if(is_customize_preview()){
    function ctm_logo_custom_arr(){
        $logo_item = [
            ['radio', 'logo_switch','', '<h2 class="ctm_ttl_ptn_1">ロゴ部分</h2><h3 class="ctm_ttl_ptn_2">表示切替</h3>' , [
                'logo_img' => 'ロゴ画像',
                'logo_text' => 'テキスト',
                'none' => '非表示'
            ]],
            ['text', 'logo_text', '', '<h3 class="ctm_ttl_ptn_2" style="margin-top:-12px;">テキスト表示の場合</h3>テキストを入力'],
            ['color', 'logo_text_color', ''],
            ['select', 'logo_text_font', '', 'フォントの指定' , ctm_font_family_arr()],
            ['select', 'font_weight', '', 'フォントの太さ' , ctm_font_weight_arr()],
            ['range', 'logo_text_size_pc', '', '文字サイズ（パソコンの時）'],
            ['range', 'logo_text_size_tb', '', '文字サイズ（タブレットの時）'],
            ['range', 'logo_text_size_sp', '', '文字サイズ（スマホの時）'],
            ['img', 'logo_img',  '','<h3 class="ctm_ttl_ptn_2">画像表示の場合</h3>画像を選択'],
            ['range', 'logo_img_size_pc', '', '画像サイズ（パソコンの時）'],
            ['range', 'logo_img_size_tb', '', '画像サイズ（タブレットの時）'],
            ['range', 'logo_img_size_sp', '', '画像サイズ（スマホの時）'],
            ];
        return $logo_item;
    }
}
function Lw_logo_set($item = []) {
    // デフォルト値の設定
    $defaults = [
        "location" => "header",
        "ptn" => "ptn_2",
        "df_logo_switch" => "logo_img",
        "df_logo_text" => get_bloginfo('name'),
        "df_logo_text_color" => "#111",
        "df_logo_text_font" => "mincho",
        "df_font_weight" => "",
        "df_logo_text_size_pc" => "38",
        "df_logo_text_size_tb" => "34",
        "df_logo_text_size_sp" => "30",
        "df_logo_img" => "",
        "df_logo_img_size_pc" => "38",
        "df_logo_img_size_tb" => "34",
        "df_logo_img_size_sp" => "30",
    ];
    // $item と $defaults をマージし、$item にないキーにはデフォルト値を使用
    $item = array_merge($defaults, $item);

    //代入
    $location = $item["location"];
    $ptn = $item["ptn"];
    $class = ".{$location}_{$ptn}";
    $set_id = "{$location}_{$ptn}_set";
    $df_logo_switch = $item["df_logo_switch"];
    $df_logo_text = esc_attr($item["df_logo_text"]);
     // カスタムロゴのURLを取得
     $custom_logo_id = get_theme_mod('custom_logo');
     $logo_url = wp_get_attachment_image_url($custom_logo_id, 'full');
     $logo_url = Lw_theme_mod_set("{$set_id}_logo_img",$logo_url);
     //固定ページにロゴが設定されている場合
     $logo_page_text = Lw_put_text("logo_header_page_text");
     $logo_page_url = Lw_put_text("logo_header_page_img");
     if($location === "footer"){
        $logo_page_text = Lw_put_text("logo_footer_page_text",$logo_page_text);
        $logo_page_url = Lw_put_text("logo_footer_page_img", $logo_page_url);
  
     }
     if(!empty($logo_page_url)){
        $logo_url = $logo_page_url;
     }
     if(!empty($logo_page_text)){
        $df_logo_text = $logo_page_text;
     }
     $logo_page_img_size_pc = Lw_theme_mod_set("{$set_id}_logo_img_size_pc",$item["df_logo_img_size_pc"]);
     $logo_page_img_size_tb = Lw_theme_mod_set("{$set_id}_logo_img_size_tb",$item["df_logo_img_size_tb"]);
     $logo_page_img_size_sp = Lw_theme_mod_set("{$set_id}_logo_img_size_sp",$item["df_logo_img_size_sp"]);
     $logo_page_text_size_pc = Lw_theme_mod_set("{$set_id}_logo_text_size_pc",$item["df_logo_text_size_pc"]);
     $logo_page_text_size_tb = Lw_theme_mod_set("{$set_id}_logo_text_size_tb",$item["df_logo_text_size_tb"]);
     $logo_page_text_size_sp = Lw_theme_mod_set("{$set_id}_logo_text_size_sp",$item["df_logo_text_size_sp"]);
     if($location == "header"){
         if(!empty($logo_page_text) || !empty($logo_page_url)){
            $logo_page_img_size_pc = Lw_put_range("logo_header_page_size_pc");
            $logo_page_img_size_tb = Lw_put_range("logo_header_page_size_tb");
            $logo_page_img_size_sp = Lw_put_range("logo_header_page_size_sp");
            $logo_page_text_size_pc = Lw_put_range("logo_header_page_size_pc");
            $logo_page_text_size_tb = Lw_put_range("logo_header_page_size_tb");
            $logo_page_text_size_sp = Lw_put_range("logo_header_page_size_sp");
    
         }
         $font_family = Lw_put_text("logo_text_font_family",Lw_theme_mod_set("{$set_id}_logo_text_font", $item["df_logo_text_font"]));
         $font_weight = Lw_put_text("logo_text_font_weight",Lw_theme_mod_set("{$set_id}_font_weight", $item["df_font_weight"]));
     }else{
        if(!empty($logo_page_text) || !empty($logo_page_url)){
            $logo_page_img_size_pc = Lw_put_range("logo_footer_page_size_pc");
            $logo_page_img_size_tb = Lw_put_range("logo_footer_page_size_tb");
            $logo_page_img_size_sp = Lw_put_range("logo_footer_page_size_sp");
            $logo_page_text_size_pc = Lw_put_range("logo_footer_page_size_pc");
            $logo_page_text_size_tb = Lw_put_range("logo_footer_page_size_tb");
            $logo_page_text_size_sp = Lw_put_range("logo_footer_page_size_sp");
    
        }
        $font_family = Lw_put_text("logo_footer_text_font_family",Lw_theme_mod_set("{$set_id}_logo_text_font", $item["df_logo_text_font"]));
        $font_weight = Lw_put_text("logo_footer_text_font_weight",Lw_theme_mod_set("{$set_id}_font_weight", $item["df_font_weight"]));
     }
     $logo_switch = Lw_theme_mod_set("{$set_id}_logo_switch",$df_logo_switch);
     $logo_page_switch = Lw_put_text("logo_header_page_switch","");
     if($location === "footer"){
        $logo_page_switch = Lw_put_text("logo_footer_page_switch", $logo_page_switch);
     }
     if(!empty($logo_page_switch)){
        $logo_switch = $logo_page_switch;
     }
?>
<a href="<?=home_url()?>" itemprop="url">
    <?php 
    
    if($logo_switch === "logo_img" && !empty($logo_url)):
    ?>
        <img src="<?php echo esc_url($logo_url); ?>" alt="<?=$df_logo_text?>" itemprop="logo">
    <?php 
    elseif($logo_switch === "logo_text" || empty($logo_url)): ?>
        <span class="text fw-<?=$font_weight?>" data-lw_font_set="<?=$font_family?>">
            <?php
                if(!empty($logo_page_text)){
                    echo $logo_page_text;
                }else{
                    echo Lw_theme_mod_set("{$set_id}_logo_text", $df_logo_text);
                }
            ?>
        </span>
    <?php endif; ?>
</a>
<style>
    <?php 
        if($logo_switch === "logo_img" && !empty($logo_url)): 
        // 画像の場合 ?>
    <?=$class?> .logo a img{
        height: <?=$logo_page_img_size_pc?>px;
    }
    @media (max-width: 1080px) {
        <?=$class?> .logo a img{
            height: <?=$logo_page_img_size_tb?>px;
        }   
    }
    @media (max-width: 500px) {
        <?=$class?> .logo a img{
            height: <?=$logo_page_img_size_sp?>px;
        }
    }
    <?php else: 
        //テキストの場合  ?>
    <?=$class?> .logo a .text{
        font-size: <?=$logo_page_text_size_pc?>px;
        color: <?=Lw_theme_mod_set("{$set_id}_logo_text_color",$item["df_logo_text_color"])?>;
    }
    @media (max-width: 1080px) {
        <?=$class?> .logo a .text{
            font-size: <?=$logo_page_text_size_tb?>px;
        }   
    }
    @media (max-width: 500px) {
        <?=$class?> .logo a .text{
            font-size: <?=$logo_page_text_size_sp?>px;
        }
    }
    <?php endif; ?>
</style>
<?php }
if (is_customize_preview()) {
    function ctm_header_menu_custom_arr($item_set = []) {
        $defaults = [
            "current" => "on",
        ];
        $item_set = array_merge($defaults, $item_set);  // 修正：スコープを関数内に変更
        $item = [];
        $item[] = ['select', 'menu_select', '', '<h2 class="ctm_ttl_ptn_1">メニュー部分</h2>メニューセレクト', ctm_menu_arr()];
        $item[] = ['select', 'menu_font', '', 'フォント', ctm_font_family_arr()];

        $item[] = ['color', 'menu_1st_layer_text_color', '', '<h3 class="ctm_ttl_ptn_2">第１階層目</h3>テキスト色'];
        if ($item_set["current"] === "on") {
            $item[] = ['color', 'menu_current_text_color', '', 'カレントテキスト色'];
            $item[] = ['color', 'menu_current_bg_color', '', 'カレント背景色'];
        }
        $item[] = ['color', 'menu_1st_layer_hover_text_color', '', '<b>カーソルを当てた時（hover時）の</b><br>テキスト色'];
        $item[] = ['color', 'menu_1st_layer_hover_bg_color', '', '背景色'];

        $item[] = ['color', 'menu_2st_layer_text_color', '', '<h3 class="ctm_ttl_ptn_2">第２階層目以降</h3>テキスト色'];
        $item[] = ['color', 'menu_2st_layer_bg_color', '', '背景色'];
        $item[] = ['color', 'menu_2st_layer_hover_text_color', '', '<b>カーソルを当てた時（hover時）の</b><br>テキスト色'];
        $item[] = ['color', 'menu_2st_layer_hover_bg_color', '', '背景色'];

        return $item;
    }
}
function Lw_header_menu_put($item = []){
    // デフォルト値の設定
    $defaults = [
        "location" => "header",
        "ptn" => "ptn_1",
        "df_menu_select" => "",
        "df_menu_font" => "",
        "df_menu_1st_layer_text_color" => "#000",
        "df_menu_current_text_color" => "#000",
        "df_menu_current_bg_color" => "var(--color-accent)",
        "df_menu_1st_layer_hover_text_color" => "#000",
        "df_menu_1st_layer_hover_bg_color" => "var(--color-yellow)",
        "df_menu_2st_layer_text_color" => "#fff",
        "df_menu_2st_layer_bg_color" => "var(--color-main)",
        "df_menu_2st_layer_hover_text_color" => "#ffffff",
        "df_menu_2st_layer_hover_bg_color" => "var(--color-accent)",
    ];
    // $item と $defaults をマージし、$item にないキーにはデフォルト値を使用
    $item = array_merge($defaults, $item);
    //代入
    $location = $item["location"];
    $ptn = $item["ptn"];
    $class = ".{$location}_{$ptn}";
    $set_id = "{$location}_{$ptn}_set";
    $menu_select = Lw_theme_mod_set("{$set_id}_menu_select",$item["df_menu_select"]);
    $menu_select = Lw_put_text("header_menu_select",$menu_select);
    $menu_font = Lw_theme_mod_set("{$set_id}_menu_font",$item["df_menu_font"]);
    $menu_1st_layer_text_color = Lw_theme_mod_set("{$set_id}_menu_1st_layer_text_color",$item["df_menu_1st_layer_text_color"]);
    $menu_current_text_color = Lw_theme_mod_set("{$set_id}_menu_current_text_color",$item["df_menu_current_text_color"]);
    $menu_current_bg_color = Lw_theme_mod_set("{$set_id}_menu_current_bg_color",$item["df_menu_current_bg_color"]);
    $menu_1st_layer_hover_text_color = Lw_theme_mod_set("{$set_id}_menu_1st_layer_hover_text_color",$item["df_menu_1st_layer_hover_text_color"]);
    $menu_1st_layer_hover_bg_color = Lw_theme_mod_set("{$set_id}_menu_1st_layer_hover_bg_color",$item["df_menu_1st_layer_hover_bg_color"]);
    $menu_2st_layer_text_color = Lw_theme_mod_set("{$set_id}_menu_2st_layer_text_color",$item["df_menu_2st_layer_text_color"]);
    $menu_2st_layer_bg_color = Lw_theme_mod_set("{$set_id}_menu_2st_layer_bg_color",$item["df_menu_2st_layer_bg_color"]);
    $menu_2st_layer_hover_text_color = Lw_theme_mod_set("{$set_id}_menu_2st_layer_hover_text_color",$item["df_menu_2st_layer_hover_text_color"]);
    $menu_2st_layer_hover_bg_color = Lw_theme_mod_set("{$set_id}_menu_2st_layer_hover_bg_color",$item["df_menu_2st_layer_hover_bg_color"]);
    // メニューの表示
    wp_nav_menu(
        array_filter(array(
            'menu' => !empty($menu_select) ? $menu_select : null, // `$menu_select` が設定されている場合のみ `menu` を指定
            'theme_location' => empty($menu_select) ? $location : null, // `$menu_select` が `null` の場合に `theme_location` を設定
            'container' => false, // `div` タグの生成を無効化
            'container_class' => '', // クラス名を無効化
            'fallback_cb' => false,
            'items_wrap' => '<ul data-lw_font_set="'.$menu_font.'" class="header_menu_pc">%3$s</ul>', // 自分で定義した `ul` タグを使用
        ))
    );
    
    ?>
        <style>
        
            <?=$class?> .header_menu_pc > li >a{
                color: <?=$menu_1st_layer_text_color?>;
            }
            /* 第１階層目の処理 */
            <?php 
            if($ptn === "ptn_1" || $ptn === "ptn_4" || $ptn === "ptn_5" || $ptn === "ptn_6")://ptn_1の場合のhover時の処理
            ?> 
                <?=$class?> .header_menu_pc >li >a:hover{
                    color: <?=$menu_1st_layer_hover_text_color?>;
                }
                <?=$class?> .header_menu_pc >li >a:hover::after{
                    background: <?=$menu_1st_layer_hover_bg_color?>;
                    <?php if($ptn === "ptn_6"):?>
                        background: var(--color-main);
                    <?php endif?>
                }
                <?=$class?> .header_menu_pc>li.current-menu-item>a{
                    color: <?=$menu_current_text_color?>;
                }
                <?=$class?> .header_menu_pc>li.current-menu-item>a::after{
                    background: <?=$menu_current_bg_color?>;
                }
            <?php endif; ?>
            <?php 
            if($ptn === "ptn_2" || $ptn === "ptn_3")://ptn_2の場合のhover時の処理
            ?> 
                <?=$class?> .header_menu_pc>li.current-menu-item>a{
                    color: <?=$menu_current_text_color?>;
                    background: <?=$menu_current_bg_color?>;
                }
                <?=$class?> .header_menu_pc >li >a:hover{
                    color: <?=$menu_1st_layer_hover_text_color?>;
                    background: <?=$menu_1st_layer_hover_bg_color?>;
                }
                
            <?php endif; ?>
            /* 第２階層目以降の処理 */
            <?=$class?> .header_menu_pc li>ul{
                background: <?=$menu_2st_layer_bg_color?>;
            }
            <?=$class?> .header_menu_pc li>ul a{
                color: <?=$menu_2st_layer_text_color?>;
            }
            <?=$class?> .header_menu_pc li>ul a:hover{
                color: <?=$menu_2st_layer_hover_text_color?>;
                background: <?=$menu_2st_layer_hover_bg_color?>;
            }
        </style>
    <?php
}
function Lw_follow_menu_put($item = []){
    // デフォルト値の設定
    $defaults = [
        "location" => "header",
        "ptn" => "ptn_1",
        "df_menu_select" => "",
    ];
    // $item と $defaults をマージし、$item にないキーにはデフォルト値を使用
    $item = array_merge($defaults, $item);
    //代入
    $location = $item["location"];
    $ptn = $item["ptn"];
    $class = ".{$location}_{$ptn}";
    $set_id = "{$location}_{$ptn}_set";
    $menu_select = Lw_theme_mod_set("{$set_id}_menu_select",$item["df_menu_select"]);
    $follow_switch = Lw_theme_mod_set("{$set_id}_follow_switch","off");
    if($follow_switch === "on_pc_menu_1"){

        // メニューの表示
        echo "<nav class='lw_follow_menu ptn_1'>";
        wp_nav_menu(
            array_filter(array(
                'menu' => !empty($menu_select) ? $menu_select : null, // `$menu_select` が設定されている場合のみ `menu` を指定
                'theme_location' => empty($menu_select) ? $location : null, // `$menu_select` が `null` の場合に `theme_location` を設定
                'container' => false, // `div` タグの生成を無効化
                'container_class' => '', // クラス名を無効化
                'fallback_cb' => false,
                'items_wrap' => '<ul class="header_menu_pc">%3$s</ul>', // 自分で定義した `ul` タグを使用
            ))
        );
        echo "</nav>";
    }
    ?>
    <?php
}
if(is_customize_preview()){
    //電話番号
    function ctm_cta_tel_arr(){
        $cta_tel_item = [
            ['radio', 'cta_tel_switch', '','<h2 class="ctm_ttl_ptn_1">電話CTA</h2>', ctm_switch_array()],
            ['text', 'cta_tel_number_text', '', '<h3 class="ctm_ttl_ptn_2">番号</h3>電話番号を半角でハイフンありで入力してください'],
            ['color', 'cta_tel_number_color', '', ''],
            ['select', 'cta_tel_number_font', '', '',ctm_font_family_arr()],
            ['select', 'cta_tel_number_font_weight', '', '',ctm_font_weight_arr()],
            ['text', 'cta_tel_sub_text', '', '<h3 class="ctm_ttl_ptn_2">補足テキスト</h3>※例：受付時間 9:00〜18:00'],
            ['color', 'cta_tel_sub_text_color', '', ''],
            ['select', 'cta_tel_sub_text_font', '', '',ctm_font_family_arr()],
            ['select', 'cta_tel_sub_text_font_weight', '', '',ctm_font_weight_arr()],
            ['select', 'cta_tel_icon_select', '', '<h3 class="ctm_ttl_ptn_2">アイコン</h3>選択してください',ctm_tel_icon_arr()],
            ['color', 'cta_tel_icon_color', '', 'アイコンの色'],
           
        ];
        return $cta_tel_item;
    }
}
function Lw_cta_tel_set($item = []) {
    // デフォルト値の設定
    $defaults = [
        "location" => "header",
        "ptn" => "ptn_1",
        "class" => "",
        "switch" => "off",
        "number_text" => "03-1234-5678",
        "number_color" => "var(--color-main)",
        "number_font" => "",
        "number_font_weight" => "600",
        "sub_text" => "受付時間 9:00〜18:00",
        "sub_text_color" => "var(--color-black)",
        "sub_text_font" => "",
        "sub_text_font_weight" => "400",
        "icon_select" => "tel",
        "icon_color" => "var(--color-main)",
    ];
    $item = array_merge($defaults, $item);
    // 変数の設定
    $class = ".{$item['class']}";
    $switch = $item["switch"];
    $set_id = "{$item['location']}_{$item['ptn']}_set";
    // デフォルト値の代入
    $df_number_text = esc_html($item["number_text"]);
    $df_number_color = esc_attr($item["number_color"]);
    $df_number_font = esc_attr($item["number_font"]);
    $df_number_font_weight = esc_attr($item["number_font_weight"]);
    $df_sub_text = esc_html($item["sub_text"]);
    $df_sub_text_color = esc_attr($item["sub_text_color"]);
    $df_sub_text_font = esc_attr($item["sub_text_font"]);
    $df_sub_text_font_weight = esc_attr($item["sub_text_font_weight"]);
    $df_icon_select = esc_attr($item["icon_select"]);
    $df_icon_color = esc_attr($item["icon_color"]);
    // カスタマイザー設定の値を取得
    $cta_tel_switch = Lw_theme_mod_set("{$set_id}_cta_tel_switch", $switch);
    $cta_tel_number_text = Lw_theme_mod_set("{$set_id}_cta_tel_number_text", $df_number_text);
    $cta_tel_number_color = Lw_theme_mod_set("{$set_id}_cta_tel_number_color", $df_number_color);
    $cta_tel_number_font = Lw_theme_mod_set("{$set_id}_cta_tel_number_font", $df_number_font);
    $cta_tel_number_font_weight = Lw_theme_mod_set("{$set_id}_cta_tel_number_font_weight", $df_number_font_weight);
    $cta_tel_sub_text = Lw_theme_mod_set("{$set_id}_cta_tel_sub_text", $df_sub_text);
    $cta_tel_sub_text_color = Lw_theme_mod_set("{$set_id}_cta_tel_sub_text_color", $df_sub_text_color);
    $cta_tel_sub_text_font = Lw_theme_mod_set("{$set_id}_cta_tel_sub_text_font", $df_sub_text_font);
    $cta_tel_sub_text_font_weight = Lw_theme_mod_set("{$set_id}_cta_tel_sub_text_font_weight", $df_sub_text_font_weight);
    $cta_tel_icon_select = Lw_theme_mod_set("{$set_id}_cta_tel_icon_select", $df_icon_select);
    $cta_tel_icon_color = Lw_theme_mod_set("{$set_id}_cta_tel_icon_color", $df_icon_color);
    if ($cta_tel_switch == "on") :?>
        <div>
            <div class="cta_tel_set ptn_1">
                <a href="tel:<?=$cta_tel_number_text?>">
                    <div class="tel_in">
                        <?php if(!empty($cta_tel_icon_select) && $cta_tel_icon_select !== "none"): ?>
                            <div class="icon"><?php get_template_part("assets/image/icon/{$cta_tel_icon_select}") ?></div>
                        <?php endif; ?>
                        <div class="tel_number" data-lw_font_set="<?=$cta_tel_number_font?>"><?=$cta_tel_number_text?></div>
                    </div>
                    <div class="tel_sub_text" data-lw_font_set="<?=$cta_tel_sub_text_font?>"><?=$cta_tel_sub_text?></div>
                </a>
            </div>
            <style>
                .cta_tel_set.ptn_1 {
                    a{
                        .tel_in{
                            display: flex;
                            align-items: center;
                            font-size:32px;
                            .icon{
                                margin-right: 0.3em;
                                height: 0.95em;
                                svg{
                                    height: 100%;
                                    width: auto;
                                    fill: <?=$cta_tel_icon_color?>;
                                }
                            } 
                            .tel_number{
                                color: <?=$cta_tel_number_color?>;
                                line-height: 1;
                                font-weight: <?=$cta_tel_number_font_weight?>;
                                white-space: nowrap;

                            }
                        }
                        .tel_sub_text{
                            color: <?=$cta_tel_sub_text_color?>;
                            font-weight: <?=$cta_tel_sub_text_font_weight?>;
                            white-space: nowrap;
                            margin-top: 0.2em;
                            line-height: 1.5;
                        }

                    }
                }
            </style>
        </div>
    <?php endif;

};
if(is_customize_preview()){
    //アクションボタン 1
    function ctm_cta_btn_1_arr(){
        $cta_btn_item = [
            ['radio', 'cta_btn_switch', '','<h2 class="ctm_ttl_ptn_1">アクションボタン</h2>', ctm_switch_array()],
            ['text', 'cta_btn_text', '', 'テキスト'],
            ['text', 'cta_btn_link', '', 'リンク（URL）'],
            ['color', 'cta_btn_bg_color', '', '背景色'],
            ['color', 'cta_btn_text_color', '', 'テキスト色'],
            ['color', 'cta_btn_bd_color', '', '外枠の色'],
            ['range', 'cta_btn_bd_width', '', '外枠の太さ'],
            ['range', 'cta_btn_border_radius', '', '角丸の加減'],
            ['color', 'cta_btn_hover_bg_color', '', '<h3 class="ctm_ttl_ptn_2">マウスを当てた時の色</h3>背景色'],
            ['color', 'cta_btn_hover_text_color', '', 'テキスト色'],
            ['color', 'cta_btn_hover_bd_color', '', '外枠の色'],
        ];
        return $cta_btn_item;
    }
}
function Lw_cta_btn_1_set($item = []) {
    // デフォルト値の設定
    $defaults = [
        "location" => "header",
        "ptn" => "ptn_2",
        "class" => "",
        "df_cta_btn_switch" => "on",
        "df_cta_btn_text" => "ご予約はこちら",
        "df_cta_btn_link" => "#",
        "df_cta_btn_bg_color" => "var(--color-main)",
        "df_cta_btn_text_color" => "#ffffff",
        "df_cta_btn_bd_color" => "var(--color-main)",
        "df_cta_btn_bd_width" => "0",
        "df_cta_btn_border_radius" => "0",
        "df_cta_btn_hover_bg_color" => "",
        "df_cta_btn_hover_text_color" => "",
        "df_cta_btn_hover_bd_color" => "",
    ];
    
    // $item と $defaults をマージし、$item にないキーにはデフォルト値を使用
    $item = array_merge($defaults, $item);

    // 変数の設定
    $location = $item["location"];
    $ptn = $item["ptn"];
    $class = ".{$location}_{$ptn}";
    if(!empty($item["class"])){
        $class = ".".$item["class"];
    }
    $set_id = "{$location}_{$ptn}_set";
    
    // デフォルト値の代入
    $df_cta_btn_switch = $item["df_cta_btn_switch"];
    $df_cta_btn_text = esc_html($item["df_cta_btn_text"]);
    $df_cta_btn_link = esc_url($item["df_cta_btn_link"]);
    $df_cta_btn_bg_color = esc_attr($item["df_cta_btn_bg_color"]);
    $df_cta_btn_text_color = esc_attr($item["df_cta_btn_text_color"]);
    $df_cta_btn_bd_color = esc_attr($item["df_cta_btn_bd_color"]);
    $df_cta_btn_bd_width = esc_attr($item["df_cta_btn_bd_width"]);
    $df_cta_btn_border_radius = esc_attr($item["df_cta_btn_border_radius"]);
    $df_cta_btn_hover_bg_color = esc_attr($item["df_cta_btn_hover_bg_color"]);
    $df_cta_btn_hover_text_color = esc_attr($item["df_cta_btn_hover_text_color"]);
    $df_cta_btn_hover_bd_color = esc_attr($item["df_cta_btn_hover_bd_color"]);
    
    // カスタマイザー設定の値を取得
    $cta_btn_switch = Lw_theme_mod_set("{$set_id}_cta_btn_switch", $df_cta_btn_switch);
    $cta_btn_text = Lw_theme_mod_set("{$set_id}_cta_btn_text", $df_cta_btn_text);
    $cta_btn_link = Lw_theme_mod_set("{$set_id}_cta_btn_link", $df_cta_btn_link);
    $cta_btn_bg_color = Lw_theme_mod_set("{$set_id}_cta_btn_bg_color", $df_cta_btn_bg_color);
    $cta_btn_bg_color = Lw_put_color("header_page_cta_color_bg", "","",$cta_btn_bg_color);
    $cta_btn_text_color = Lw_theme_mod_set("{$set_id}_cta_btn_text_color", $df_cta_btn_text_color);
    $cta_btn_bd_color = Lw_theme_mod_set("{$set_id}_cta_btn_bd_color", $df_cta_btn_bd_color);
    $cta_btn_bd_width = Lw_theme_mod_set("{$set_id}_cta_btn_bd_width", $df_cta_btn_bd_width);
    $cta_btn_border_radius = Lw_theme_mod_set("{$set_id}_cta_btn_border_radius", $df_cta_btn_border_radius);
    $cta_btn_hover_bg_color = Lw_theme_mod_set("{$set_id}_cta_btn_hover_bg_color", $df_cta_btn_hover_bg_color);
    $cta_btn_hover_text_color = Lw_theme_mod_set("{$set_id}_cta_btn_hover_text_color", $df_cta_btn_hover_text_color);
    $cta_btn_hover_bd_color = Lw_theme_mod_set("{$set_id}_cta_btn_hover_bd_color", $df_cta_btn_hover_bd_color);

    // ボタンの表示設定
    if ($cta_btn_switch === "on"): ?>
        <a href="<?= $cta_btn_link ?>" class="cta_btn">
            <?= $cta_btn_text ?>
        </a>
        <style>
            <?=$class?> .cta_btn {
                color: <?= $cta_btn_text_color ?>;
                border-radius: <?= $cta_btn_border_radius ?>px;
            }
            <?=$class?> .cta_btn:after {
                background: <?= $cta_btn_bg_color ?>;
                border-radius: <?= $cta_btn_border_radius ?>px;
                border-style: solid;
                border-color: <?= $cta_btn_bd_color ?>;
                border-width: <?= $cta_btn_bd_width ?>px;
            }
            <?=$class?> .cta_btn:hover {
                color: <?= $cta_btn_hover_text_color ?>;
            }
            <?=$class?> .cta_btn:hover:after {
                border-color: <?= $cta_btn_hover_bd_color ?>;
                background: <?= $cta_btn_hover_bg_color ?>;
            }
        </style>
    <?php endif;
}
if (is_customize_preview()) {
    function ctm_drawer_menu_custom_arr($item_set = []) {
        $item = [];
        $item[] = ['select', 'menu_select', '', '<h2 class="ctm_ttl_ptn_1">メニュー部分</h2>メニューセレクト', ctm_menu_arr()];
        $item[] = ['select', 'menu_font', '', 'フォント', ctm_font_family_arr()];

        $item[] = ['color', 'menu_1st_layer_text_color', '', '<h3 class="ctm_ttl_ptn_2">第１階層目</h3>テキスト色'];
        $item[] = ['color', 'menu_1st_layer_bg_color', '', '背景色'];

        $item[] = ['color', 'menu_2st_layer_text_color', '', '<h3 class="ctm_ttl_ptn_2">第２階層目以降</h3>テキスト色'];
        $item[] = ['color', 'menu_2st_layer_bg_color', '', '背景色'];

        return $item;
    }
}
//ctm_sns_icon_set_custom_arr
if(is_customize_preview()){
    function ctm_sns_icon_set_custom_arr($set_arr = []){
        $defaults = [
            "number_of_items" => 3,
            "sns_bg_color_switch" => "on",
            "icon_color_switch" => "on",
        ];
        $set_arr = array_merge($defaults, $set_arr);

        $item = [];
        $item[] = ['radio', 'sns_switch','',  '<h2 class="ctm_ttl_ptn_1">SNS部分</h2>', ctm_switch_array_2()];
        if($set_arr["sns_bg_color_switch"] === "on"){
            $item[] =   ['color', 'sns_bg_color', '', '背景色'];
        }
        if($set_arr["icon_color_switch"] === "on"){
            $item[] = ['color', 'sns_icon_color', '', 'アイコン色'];
        }
        for ($i=1; $i <= $set_arr["number_of_items"]; $i++) { 
            $item[] = ['select', 'sns_'.$i.'_icon', '', '<h3 class="ctm_ttl_ptn_2">SNS '.$i.'</h3>アイコンの選択' , ctm_sns_icon_arr()];
            $item[] = ['text', 'sns_'.$i.'_link', '', 'リンク（URL）'];
        }
        return $item;
    }
}
function Lw_sns_icon_1_set($set_arr = []) {
        // デフォルト値の設定
        $defaults = [
            "location" => "footer",
            "ptn" => "ptn_2",
            "sns_switch" => "on",
            "number_of_items" => "3",
            "sns_bg_color_switch" => "on",
            "sns_bg_color" => "var(--color-main)",
            "icon_color_switch" => "on",
            "icon_color" => "var(--color-main)",
        ];
        $set_arr = array_merge($defaults, $set_arr);
        //代入
        $location = $set_arr["location"];
        $ptn = $set_arr["ptn"];
        $class = ".{$location}_{$ptn}_set";
        $set_id = "{$location}_{$ptn}_set";
        $sns_switch = Lw_theme_mod_set("{$set_id}_sns_switch", $set_arr["sns_switch"]);
        if($sns_switch === "off") return;
        $number_of_items = $set_arr["number_of_items"];
        $sns_bg_color_switch = $set_arr["sns_bg_color_switch"];
        $sns_bg_color = Lw_theme_mod_set("{$set_id}_sns_bg_color", $set_arr["sns_bg_color"]);
        $icon_color_switch = $set_arr["icon_color_switch"];
        $icon_color = Lw_theme_mod_set("{$set_id}_sns_icon_color", $set_arr["icon_color"]);
?>
    <nav class="sns_links <?=$set_id?>">
        <ul>
            <?php
                for ($i=1; $i <= $number_of_items; $i++) :
                    $sns_icon = Lw_theme_mod_set("{$set_id}_sns_".$i."_icon", "");
                    $sns_link = Lw_theme_mod_set("{$set_id}_sns_".$i."_link", "#");
                    if(empty($sns_icon)) {
                        switch ($i) {
                            case '1':
                                $sns_icon = "facebook";
                                break;
                            case '2':
                                $sns_icon = "line";
                                break;
                            case '3':
                                $sns_icon = "mail";
                                break;
                            
                            default:
                                $sns_icon = "none";
                                break;
                        }
                    }
                    if($sns_icon === "none") continue;
            ?>
            <li>
                <a href="<?=$sns_link?>" <?=new_tab()?>>
                    <?php get_template_part('assets/image/icon/'.$sns_icon); ?>
                </a>
            </li>
            <?php endfor; ?>
        </ul>
    </nav>
    <style>
        <?php 
        if($ptn === "ptn_1")://ptn_1の場合のhover時の処理
        ?> 
            <?=".".$set_id?>.sns_links ul{
                background-color: <?=$sns_bg_color?>;
            }
        <?php endif; ?>
        <?=".".$set_id?>.sns_links ul li a svg {
            fill : <?=$icon_color?>;
        }
    </style>
<?php
}
//ctm_copyright_custom_arr
if(is_customize_preview()){
    function ctm_copyright_custom_arr($set_arr = []){
        $defaults = [
            "number_of_items" => 3,
            "sns_bg_color_switch" => "on",
            "icon_color_switch" => "on",
        ];
        $set_arr = array_merge($defaults, $set_arr);

        $item = [];
        $item[] = ['radio', 'copy_switch','',  '<h2 class="ctm_ttl_ptn_1">コピーライト部分</h2>', ctm_switch_array_2()];
        $item[] = ['text', 'text','',  '表示テキスト'];
        $item[] = ['color', 'color_text', '', 'テキスト色'];
        $item[] = ['color', 'background_color', '', '背景色'];
        return $item;
    }
}
function Lw_copyright_1_set($set_arr = []) {
    // デフォルト値の設定
    $defaults = [
        "location" => "footer",
        "ptn" => "ptn_2",
        "copy_switch" => "on",
        "text" => get_bloginfo('name')." All Right Reserved.",
        "color_text" => "#fff",
        "background_color" => "",
    ];
    $set_arr = array_merge($defaults, $set_arr);
    //代入
    $location = $set_arr["location"];
    $ptn = $set_arr["ptn"];
    $class = ".{$location}_{$ptn}_set";
    $set_id = "{$location}_{$ptn}_set";
    $copy_switch = Lw_theme_mod_set("{$set_id}_copy_switch", $set_arr["copy_switch"]);
    $text = Lw_theme_mod_set("{$set_id}_text", $set_arr["text"]);
    $color_text = Lw_theme_mod_set("{$set_id}_color_text", $set_arr["color_text"]);
    $background_color = Lw_theme_mod_set("{$set_id}_background_color", $set_arr["background_color"]);

    if($copy_switch === "on"):
    ?>
    <div class="copyright" style="background-color:<?=$background_color?>;">
        <p style="color:<?=$color_text?>;"><span>©</span><?= date('Y')?> <?=$text?></p>
    </div>
    <?php endif; ?>
<?php
}

/** ----------------------------------------------
 * カスタマイザーのページ以外で
 * カスタマイザーのデータを出し入れするための関数
* ------------------------------------------------- */
if(is_admin()){
    function Lw_theme_mod_text($mod_name = "", $input_type = "text", $df = "", $placeholder = "", $class = "", $rows = "10") {
        // 初期化
        $mod_val = Lw_theme_mod_set($mod_name, $df); // デフォルト値を指定

        // 更新された時の処理
        if (isset($_POST[$mod_name])) {
            // POST されたデータを取得
            $mod_val = $_POST[$mod_name];
            // POST された値を $mod_name に保存 (テーマモディファイとして保存)
            set_theme_mod($mod_name, $mod_val);
        }

        // 入力タイプに応じたHTMLを出力
        switch ($input_type) {
            case 'text':
                echo "<input type='text' name='$mod_name' value='$mod_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'textarea':
                echo "<textarea name='$mod_name' cols='30' rows='$rows' placeholder='$placeholder' class='$class'>$mod_val</textarea>";
                break;
            case 'color':
                echo "<input type='color' name='$mod_name' value='$mod_val' class='$class'>";
                break;
            case 'number':
                echo "<input type='number' name='$mod_name' value='$mod_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'email':
                echo "<input type='email' name='$mod_name' value='$mod_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'tel':
                echo "<input type='tel' name='$mod_name' value='$mod_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'url':
                echo "<input type='url' name='$mod_name' value='$mod_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'password':
                echo "<input type='password' name='$mod_name' value='$mod_val' placeholder='$placeholder' class='$class'>";
                break;
            case 'hidden':
                echo "<input type='hidden' name='$mod_name' value='$mod_val' class='$class'>";
                break;
            case 'range':
                if ($mod_val == "50") {
                    $mod_val = "";
                }
                echo "<input type='range' name='$mod_name' value='$mod_val' class='$class'>";
                break;
        }
    }
    function Lw_theme_mod_select($mod_name = "", $options = array(), $df = "", $placeholder = "", $class = "") {
        // 初期化
        $mod_val = Lw_theme_mod_set($mod_name, $df); // デフォルト値を指定

        // 更新された時の処理
        if (isset($_POST[$mod_name])) {
            // POST されたデータを取得
            $mod_val = $_POST[$mod_name];
            // POST された値を $mod_name に保存 (テーマモディファイとして保存)
            set_theme_mod($mod_name, $mod_val);
        }

        $selected = $mod_val;

        // セレクトボックスを生成
        echo "<select name='$mod_name' class='$class' id='cus_pr_$mod_name'>";
        if ($placeholder) {
            echo "<option value=''>$placeholder</option>";
        } else {
            echo "<option value=''>未選択</option>";
        }
        foreach ($options as $key => $option) {
            if ($selected == $key) {
                echo "<option value='$key' selected>$option</option>";
            } else {
                echo "<option value='$key'>$option</option>";
            }
        }
        echo "</select>";
    }
    function Lw_theme_mod_radio($mod_name = "", $options = array(), $df = "", $class = "") {
        // 初期化
        $mod_val = Lw_theme_mod_set($mod_name, $df); // デフォルト値を指定
    
        // 更新された時の処理
        if (isset($_POST[$mod_name])) {
            // POST されたデータを取得
            $mod_val = $_POST[$mod_name];
            // POST された値を $mod_name に保存 (テーマモディファイとして保存)
            set_theme_mod($mod_name, $mod_val);
        }
    
        // ラジオボタンの生成
        echo "<div class='Lw_radio-group $class' id='cus_pr_$mod_name'>";
        foreach ($options as $key => $option) {
            $checked = ($mod_val == $key) ? 'checked' : '';
            echo "<label>";
            echo "<input type='radio' name='$mod_name' value='$key' $checked>";
            echo esc_html($option);
            echo "</label>";
        }
        echo "</div>";
    }
    
    function Lw_theme_mod_media($mod_name = "", $class = "", $btn_text = "メディアの選択", $df = "") {
        // 初期化
        if (!is_admin()) {
            return;
        }
    
        $img_value = get_theme_mod($mod_name, $df); // 保存された値、またはデフォルト値を取得
    
        // 更新処理
        if (isset($_POST[$mod_name])) {
            // POSTデータを取得して保存
            $img_value = sanitize_text_field($_POST[$mod_name]);
            set_theme_mod($mod_name, $img_value);
        }
    
        if (empty($btn_text)) {
            $btn_text = "メディアの選択";
        }
        ?>
        <div class="costom_post_media_select">
            <?php 
            $uploade = $mod_name; 
            $uploade_url = "{$mod_name}_url"; 
            $uploade_id = "{$mod_name}_id"; 
            ?>
            <input type="hidden" name="<?php echo esc_attr($uploade); ?>" class="editor_input" id="<?php echo esc_attr($uploade_url); ?>" value="<?php echo esc_url($img_value); ?>"/>
            <input type="hidden" name="<?php echo esc_attr($uploade_id); ?>" id="<?php echo esc_attr($uploade_id); ?>" value=""/>
            
            <div class="preview_img" id="<?php echo esc_attr($uploade); ?>_past_preview">
            <?php if ($img_value): ?>
                <?php if (preg_match('/\.(jpg|jpeg|png|gif)$/i', $img_value)): ?>
                    <img loading="lazy" src="<?php echo esc_url($img_value); ?>" alt="Preview">
                <?php elseif (preg_match('/\.(mp4|webm|ogg)$/i', $img_value)): ?>
                    <video src="<?php echo esc_url($img_value); ?>" controls></video>
                <?php endif; ?>
            <?php endif; ?>
            </div>
            <div class="preview_img" id="<?php echo esc_attr($uploade); ?>_preview"></div>
            <div class="btn">
                <button
                    class="add_upload_media"
                    data-targetId="<?php echo esc_attr($uploade); ?>"
                    data-title="ファイルアップロード"
                    data-library=""
                    data-frame="select"
                    data-button="選択"
                    data-multiple="false"
                    data-preview="true"><?php echo esc_html($btn_text); ?></button>
                <button
                    class="remove_upload_media"
                    data-targetId="<?php echo esc_attr($uploade); ?>"
                    href="#">削除</button>
            </div>
        </div>
        <?php
    }
    
    
}

if (is_customize_preview()) {
    function ctm_footer_menu_custom_arr() {
        $item = [];
        $item[] = ['select', 'menu_select', '', '<h2 class="ctm_ttl_ptn_1">メニュー部分</h2>メニューセレクト', ctm_menu_arr()];
        return $item;
    }
}
function lw_footer_menu($ptn = "ptn_2") {
    $location = "footer";
    $footer_menu_id_select = Lw_theme_mod_set("footer_{$ptn}_set_menu_select");
    $footer_menu_id_select = Lw_put_text("footer_menu_select", $footer_menu_id_select);
    
    wp_nav_menu(
        array(
            'menu' => !empty($footer_menu_id_select) ? $footer_menu_id_select : null,
            'theme_location' => empty($footer_menu_id_select) ? $location : null,
            'container' => false,
            'fallback_cb' => false,
        )
    ); 
}