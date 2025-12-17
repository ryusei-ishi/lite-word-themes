<?php
if ( !defined( 'ABSPATH' ) ) exit;
//関数
get_template_part('./functions/customizer/functions');
//カスタマイザイーを開いて時のみの処理
if(is_customize_preview()){
    //カラー
    get_template_part('./functions/customizer/color');
    //共通フォント
    get_template_part('./functions/customizer/font');
    //投稿ページ
    get_template_part('./functions/customizer/single_post');
    //固定ページ
    get_template_part('./functions/customizer/page_post');
    //アーカイブページ
    get_template_part('./functions/customizer/archive_page');
    //ヘッダー
    get_template_part('./functions/customizer/header/header_set');
    get_template_part("./functions/customizer/header/ptn_1_set");
    get_template_part("./functions/customizer/header/ptn_2_set");
    get_template_part("./functions/customizer/header/ptn_3_set");
    if (templateSettingCheck("shin_gas_station_01")  || templateSettingCheck("template_001")) {
        get_template_part("./functions/customizer/header/ptn_4_set");
    }
    get_template_part("./functions/customizer/header/ptn_5_set");
    get_template_part("./functions/customizer/header/ptn_6_set");
    //ドロワー
    get_template_part('./functions/customizer/drawer/drawer_set');
    for ($i=1; $i <= 1; $i++) { 
        get_template_part("./functions/customizer/drawer/ptn_{$i}_set");
    }
    //フッター
    get_template_part('./functions/customizer/footer/footer_set');
    get_template_part("./functions/customizer/footer/ptn_1_set");
    get_template_part("./functions/customizer/footer/ptn_2_set");
    if (templateSettingCheck("shin_gas_station_01") || templateSettingCheck("template_001")) {
        get_template_part("./functions/customizer/footer/ptn_3_set");
    }
    get_template_part("./functions/customizer/footer/ptn_4_set");
    //追従CTA
    get_template_part('./functions/customizer/follow_bottom_cta/follow_bottom_cta_set');
    for ($i=1; $i <= 2; $i++) { 
        get_template_part("./functions/customizer/follow_bottom_cta/ptn_{$i}_set");
    }
    //loadingアニメーション
    get_template_part('./functions/customizer/loading_anime');
    //トップに戻るボタン
    get_template_part("./functions/customizer/return_top/return_top_set");
    for ($i=1; $i <= 2; $i++) { 
        get_template_part("./functions/customizer/return_top/ptn_{$i}_set");
    }
    //分析関係
    get_template_part('./functions/customizer/analysis');
    //head内へのコードの追記
    get_template_part('./functions/customizer/head_set');
    //期限・日程
    if(LW_EXPANSION_BASE){
        get_template_part('./functions/customizer/deadline_setting');
    }
    //クッキーの同意
    //get_template_part('./functions/customizer/cookie_consent');
    //拡張機能
    if(LW_EXPANSION_BASE){
        get_template_part('./functions/customizer/lw_extensions');
    }
}