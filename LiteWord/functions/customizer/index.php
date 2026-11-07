<?php
if ( !defined( 'ABSPATH' ) ) exit;
//関数
get_template_part('./functions/customizer/functions');
//ヘッダー・フッターのパターンの一覧と、選べる人の確かめ（選択肢・設定欄・ウィザードが読む）
get_template_part('./functions/customizer/pattern_registry');
//カスタマイザイーを開いて時のみの処理
if(is_customize_preview()){
    //カラー
    get_template_part('./functions/customizer/color');
    //共通フォント
    get_template_part('./functions/customizer/font');
    //投稿ページ
    get_template_part('./functions/customizer/single_post');
    get_template_part('./functions/customizer/single/ptn_short_code');
    //固定ページ
    get_template_part('./functions/customizer/page_post');
    //PR表記（広告・アフィリエイト）
    get_template_part('./functions/customizer/pr_notice');
    //アーカイブページ
    get_template_part('./functions/customizer/archive_page');
    get_template_part('./functions/customizer/archive/ptn_short_code');
    //ヘッダー
    get_template_part('./functions/customizer/header/header_set');
    // 各パターンの設定欄（ptn_N_set.php）は、そのサイトで選べるものだけ番号の順に読む（pattern_registry.php）
    lw_customizer_load_part_pattern_settings('header');
    get_template_part("./functions/customizer/header/ptn_short_code");
    //ドロワー
    get_template_part('./functions/customizer/drawer/drawer_set');
    for ($i=1; $i <= 1; $i++) { 
        get_template_part("./functions/customizer/drawer/ptn_{$i}_set");
    }
    //フッター
    get_template_part('./functions/customizer/footer/footer_set');
    // 各パターンの設定欄（ptn_N_set.php）は、そのサイトで選べるものだけ番号の順に読む（pattern_registry.php）
    lw_customizer_load_part_pattern_settings('footer');
    get_template_part("./functions/customizer/footer/ptn_short_code");
    //追従CTA
    get_template_part('./functions/customizer/follow_bottom_cta/follow_bottom_cta_set');
    for ($i=1; $i <= 12; $i++) {
        get_template_part("./functions/customizer/follow_bottom_cta/ptn_{$i}_set");
    }
    //サイドの追従SNSリンク
    get_template_part('./functions/customizer/side_follow_sns/side_follow_sns_set');
    for ($i=1; $i <= 4; $i++) {
        get_template_part("./functions/customizer/side_follow_sns/ptn_{$i}_set");
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
    //会員限定ページ（ログイン画面のデザイン・投稿のFVを残すか）
    if(LW_EXPANSION_BASE){
        get_template_part('./functions/customizer/membership');
    }
    //パンクズリスト
    get_template_part("./functions/customizer/lw_breadcrumb");
}