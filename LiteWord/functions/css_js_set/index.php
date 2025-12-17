<?php
if (!defined('ABSPATH')) exit;
// CSSとJSバージョン
function css_version() {
    // 現在のテーマの情報を取得
    $theme = wp_get_theme();
    // テーマのバージョンを取得し、URLパラメータ形式で返す
    return "?v=" . $theme->get('Version');
}
// フロントエンド用のCSSおよびJSファイルの読み込み
get_template_part('./functions/css_js_set/front');
//エディタ用のCSSとJS読み込み
get_template_part('./functions/css_js_set/editor');

// CSS変数を共通で適用する関数
function lw_generate_css_variables() {
    $post_id = get_the_ID();

    // カスタマイザープレビュー中はキャッシュをスキップ
    $use_cache = !is_customize_preview();

    // トランジェントキャッシュを使用してパフォーマンスを向上
    if ($use_cache && $post_id) {
        $post_modified = get_post_modified_time('U', false, $post_id);
        $cache_key = 'lw_css_vars_' . $post_id . '_' . $post_modified;
        $cached_css = get_transient($cache_key);

        if ($cached_css !== false) {
            return $cached_css;
        }
    }

    ob_start(); // 出力バッファリング開始
    ?>
    :root {
        /* ------- layout ---------*/
        --max-width-clm-1: <?php 
            $max_width_clm_1 = Lw_put_text("max_width_clm_1");
            if(empty($max_width_clm_1)){
                echo Lw_theme_mod_set("page_post_layout_max_width_clm_1", "1120px");
            } else {
                echo $max_width_clm_1;
            }
        ?>;
        /* ------- color ---------*/
        --color-background-all:<?= Lw_theme_mod_set("color_background", "#f4f4f4") ?>;
        --color-black: #060606; 
        --color-blue: #4a90e2;
        --color-red: #d34a4a;
        --color-yellow: #f9d648;
        --color-main: <?php 
            $color_main = get_post_meta(get_the_ID(), 'color_main', true);
            if(empty($color_main) || $color_main === "#ada993"){
                echo Lw_theme_mod_set("color_main", "#1a72ad");
            }else{
                echo $color_main;
            }
        ?>;
        --color-sub: <?php 
            $color_sub = get_post_meta(get_the_ID(), 'color_sub', true);
            if(empty($color_sub) || $color_sub === "#ada993"){
                echo Lw_theme_mod_set("color_sub", "#0e1013");
            } else {
                echo $color_sub;
            }
        ?>;

        --color-accent: <?php 
            $color_accent = get_post_meta(get_the_ID(), 'color_accent', true);
            if(empty($color_accent) || $color_accent === "#ada993"){
                echo Lw_theme_mod_set("color_accent", "#d34a4a");
            } else {
                echo $color_accent;
            }
        ?>;
        --color-page-bg-pc: <?php 
            $color_page_bg_pc = get_post_meta(get_the_ID(), 'color_page_bg_pc', true);
            if(empty($color_page_bg_pc) || $color_page_bg_pc === "#ada993"){
                echo Lw_theme_mod_set("color_page_bg_pc", "#ffffff");
            } else {
                echo $color_page_bg_pc;
            }
        ?>;
        --color-page-bg-sp: <?php 
            $color_page_bg_sp = get_post_meta(get_the_ID(), 'color_page_bg_sp', true);
            if(empty($color_page_bg_sp) || $color_page_bg_sp === "#ada993"){
                echo Lw_theme_mod_set("color_page_bg_sp", "#ffffff");
            } else {
                echo $color_page_bg_sp;
            }
        ?>;
        --color-content-bg-pc: <?php 
            $color_content_bg_pc = get_post_meta(get_the_ID(), 'color_content_bg_pc', true);
            if(empty($color_content_bg_pc) || $color_content_bg_pc === "#ada993"){
                echo Lw_theme_mod_set("color_content_bg_pc", "#ffffff");
            } else {
                echo $color_content_bg_pc;
            }
        ?>;
        --color-content-bg-sp: <?php 
            $color_content_bg_sp = get_post_meta(get_the_ID(), 'color_content_bg_sp', true);
            if(empty($color_content_bg_sp) || $color_content_bg_sp === "#ada993"){
                if(!empty($color_content_bg_pc) && $color_content_bg_pc !== "#ada993"){
                    echo $color_content_bg_pc;
                } else {
                    echo Lw_theme_mod_set("color_content_bg_sp", "#ffffff");
                }
            } else {
                echo $color_content_bg_sp;
            }
        ?>;
        --color-1: <?php 
            $color_1 = get_post_meta(get_the_ID(), 'color_1', true);
            if(empty($color_1) || $color_1 === "#ada993"){
                echo Lw_theme_mod_set("color_1", $color_main);
            } else {
                echo $color_1;
            }
        ?>;
         --color-2: <?php 
            $color_2 = get_post_meta(get_the_ID(), 'color_2', true);
            if(empty($color_2) || $color_2 === "#ada993"){
                echo Lw_theme_mod_set("color_2", $color_main);
            } else {
                echo $color_2;
            }
        ?>;
         --color-3: <?php 
            $color_3 = get_post_meta(get_the_ID(), 'color_3', true);
            if(empty($color_3) || $color_3 === "#ada993"){
                echo Lw_theme_mod_set("color_3", $color_main);
            } else {
                echo $color_3;
            }
        ?>;
        /* 共通リンクの色 */
        --color-link-common: <?= Lw_theme_mod_set("color_link_common", "#0066cc") ?>;
        /* 基本の文字の色 */
        --color-text: <?php 
            $color_text = get_post_meta(get_the_ID(), 'color_text', true);;
            if(empty($color_text) || $color_text === "#ada993"){
                echo Lw_theme_mod_set("color_text", "#060606");
            } else {
                echo $color_text;
            }
        ?>;
        /* ------- font ---------*/
        /* font */
        --font-family-gothic: "Hiragino Kaku Gothic ProN", "游ゴシック", "Yu Gothic", "メイリオ", "Meiryo", "ＭＳ ゴシック", "MS Gothic", sans-serif;
        --font-family-gothic_Arial: "Arial", "Hiragino Kaku Gothic ProN", "游ゴシック", "Yu Gothic", "メイリオ", "Meiryo", "ＭＳ ゴシック", "MS Gothic", sans-serif;
        --font-family-mincho: "Noto Serif JP","Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "游明朝", "ＭＳ 明朝", "MS Mincho", serif;
    }
    <?php
    $css_output = ob_get_clean(); // バッファの内容を返す

    // トランジェントにキャッシュを保存（1時間）- カスタマイザープレビュー中は保存しない
    if ($use_cache && $post_id) {
        set_transient($cache_key, $css_output, 3600);
    }

    return $css_output;
}
//font_family_switch
function Lw_font_family_switch($font_family) {
    // システムフォントの特別処理
    switch ($font_family) {
        case 'gothic':
            return "var(--font-family-gothic)";
        case 'mincho':
            return "var(--font-family-mincho)";
        case '':
            return "var(--font-family-gothic)";
    }
    
    // ctm_font_family_arr()からフォントリストを取得
    $all_fonts = ctm_font_family_arr();
    
    // フォントが存在するかチェック
    if (!array_key_exists($font_family, $all_fonts)) {
        return "var(--font-family-gothic)"; // デフォルト
    }
    
    // フォントの説明文から明朝系かどうかを判定
    $font_description = $all_fonts[$font_family];
    
    // 明朝系のキーワードをチェック
    $serif_keywords = ['明朝', '筆明朝', '装飾明朝', 'アンティーク明朝', '教科書体'];
    $is_serif = false;
    
    foreach ($serif_keywords as $keyword) {
        if (mb_strpos($font_description, $keyword) !== false) {
            $is_serif = true;
            break;
        }
    }
    
    // 筆記体系のキーワードをチェック
    $cursive_keywords = ['筆記体'];
    $is_cursive = false;
    
    foreach ($cursive_keywords as $keyword) {
        if (mb_strpos($font_description, $keyword) !== false) {
            $is_cursive = true;
            break;
        }
    }
    
    // 等幅フォントのチェック（DotGothic16など）
    $is_monospace = (mb_strpos($font_description, 'ドットゴシック') !== false);
    
    // フォントファミリーの生成
    if ($is_serif) {
        return "'{$font_family}', serif";
    } elseif ($is_cursive) {
        return "'{$font_family}', cursive";
    } elseif ($is_monospace) {
        return "'{$font_family}', monospace";
    } else {
        // デフォルトはsans-serif
        return "'{$font_family}', sans-serif";
    }
}
//fontの指定------------------------------------------------
function Lw_font_sets(){
    $post_id = get_the_ID();
    $page_type = is_page() ? 'page' : (is_single() ? 'single' : 'other');

    // トランジェントキャッシュを使用してパフォーマンスを向上
    if ($post_id) {
        $post_modified = get_post_modified_time('U', false, $post_id);
        $cache_key = 'lw_font_sets_' . $post_id . '_' . $page_type . '_' . $post_modified;
        $cached_fonts = get_transient($cache_key);

        if ($cached_fonts !== false) {
            echo $cached_fonts;
            return;
        }
    }

    ob_start(); // 出力バッファリング開始

    //body
    $font_body_page = Lw_put_text("font_body");
    $font_body = $font_body_page;
    if(empty($font_body_page)){
        $font_body = Lw_theme_mod_set("font_body", "gothic");
    }
    $font_body_cdn_set = "<div data-lw_font_set='$font_body'></div>";
    $font_body_style_set = Lw_font_family_switch($font_body);
    $font_body_weight_page = Lw_put_text("font_body_weight");
    $font_body_weight = $font_body_weight_page;
    $font_df_size_pc = "17px";
    $font_df_size_tb = "16px";
    $font_df_size_sp = "16px";
    if(empty($font_body_weight_page)){
        $font_body_weight = Lw_theme_mod_set("font_body_weight", "400");
    }
    //page
    if(is_page()){
        if(empty($font_body_page)){
            $font_body = Lw_theme_mod_set("font_page", "$font_body");
        }
        $font_body_cdn_set = "<div data-lw_font_set='$font_body'></div>";
        $font_page_style_set = Lw_font_family_switch($font_body);
        if(empty($font_body_weight_page)){
            $font_page_weight = Lw_theme_mod_set("font_page_weight", "$font_body_weight");
        }
        $font_page_size_pc = Lw_put_text("font_size_pc");
        if(empty($font_page_size_pc)){
            $font_df_size_pc = Lw_theme_mod_set("font_page_size_pc", $font_df_size_pc);
        }
        $font_page_size_tb = Lw_put_text("font_size_tb");
        if(empty($font_page_size_tb)){
            $font_df_size_tb = Lw_theme_mod_set("font_page_size_tb", $font_df_size_tb);
        }
        $font_page_size_sp = Lw_put_text("font_size_sp");
        if(empty($font_page_size_sp)){
            $font_df_size_sp = Lw_theme_mod_set("font_page_size_sp", $font_df_size_sp);
        }
    }
    //single
    if(is_single()){
        $font_single = Lw_theme_mod_set("font_single", "$font_body");
        $font_body_style_set = Lw_font_family_switch($font_single);
        $font_body_weight = Lw_theme_mod_set("font_single_weight", "$font_body_weight");
        $font_body_cdn_set = "<div data-lw_font_set='$font_single'></div>";
        $font_single_style_set = Lw_font_family_switch($font_single);
        $font_df_size_pc = Lw_theme_mod_set("font_single_size_pc", $font_df_size_pc);
        $font_df_size_tb = Lw_theme_mod_set("font_single_size_tb", $font_df_size_tb);
        $font_df_size_sp = Lw_theme_mod_set("font_single_size_sp", $font_df_size_sp);
    }
    echo $font_body_cdn_set;//CDNを読み込みするためのタグ（削除不可）

    
    ?>
        <style>
            body{
                font-family: <?=$font_body_style_set?>;
                font-weight: <?=$font_body_weight?>;
            }
            :root{
                --font-size-post-df_pc: <?=$font_df_size_pc?>;
                --font-size-post-df_tb: <?=$font_df_size_tb?>;
                --font-size-post-df_sp: <?=$font_df_size_sp?>;
            }
            <?php if(is_page()): ?>
                .post_style.page{
                    font-family: <?=$font_page_style_set?>;
                    font-weight: <?=$font_body_weight?>;
                    font-size: <?=$font_df_size_pc?>;
                }
                @media (max-width:900px) {
                    .post_style.page{
                        font-size: <?=$font_df_size_tb?>;
                    }
                }
                @container (max-width: 800px) { 
                    .post_style.page{
                        font-size: <?=$font_df_size_tb?>;
                    }
                }
                @media (max-width:600px) {
                    .post_style.page{
                        font-size: <?=$font_df_size_sp?>;
                    }
                }
                @container (max-width:500px) {
                    .post_style.page{
                        font-size: <?=$font_df_size_sp?>;
                    }
                }
            <?php endif; ?>
            <?php if(is_single()): ?>
                .post_style.single{
                    font-family: <?=$font_single_style_set?>;
                    font-weight: <?=$font_body_weight?>;
                    font-size: <?=$font_df_size_pc?>;
                }
                @media (max-width:900px) {
                    .post_style.single{
                        font-size: <?=$font_df_size_tb?>;
                    }
                }
                @container (max-width: 800px) { 
                    .post_style.single{
                        font-size: <?=$font_df_size_tb?>;
                    }
                }
                @media (max-width:600px) {
                    .post_style.single{
                        font-size: <?=$font_df_size_sp?>;
                    }
                }
                @container (max-width:500px) {
                    .post_style.single{
                        font-size: <?=$font_df_size_sp?>;
                    }
                }
            <?php endif; ?>
        </style>

    <?php
    $font_output = ob_get_clean(); // バッファの内容を取得

    // トランジェントにキャッシュを保存（1時間）
    if ($post_id) {
        set_transient($cache_key, $font_output, 3600);
    }

    echo $font_output;
}
add_action('wp_footer', 'Lw_font_sets');

//投稿と本文の見出しデザインの変更
get_template_part('./functions/heading_style');
