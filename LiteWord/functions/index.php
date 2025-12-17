<?php
if ( !defined( 'ABSPATH' ) ) exit;
function Lw_theme_mod_set($key,$df=""){//カスタマイザー出力用関数
    // カスタマイザープレビュー中はキャッシュをスキップ
    if (is_customize_preview()) {
        $set = get_theme_mod($key);
        return esc_attr($set) ? $set : $df;
    }

    // オブジェクトキャッシュを使用してパフォーマンスを向上
    $cache_key = 'lw_theme_mod_' . $key;
    $cache_group = 'lw_theme_mods';

    $cached_value = wp_cache_get($cache_key, $cache_group);
    if ($cached_value !== false) {
        return $cached_value;
    }

    $set = get_theme_mod($key);
    $result = esc_attr($set) ? $set : $df;

    // キャッシュに保存（1時間）
    wp_cache_set($cache_key, $result, $cache_group, 3600);

    return $result;
}

// カスタマイザー設定が更新された時にキャッシュをクリア
function lw_clear_theme_mods_cache() {
    // カスタマイザーで使用されるキーのキャッシュを削除
    $common_theme_mod_keys = [
        'color_main', 'color_sub', 'color_accent',
        'color_background', 'color_text',
        'color_page_bg_pc', 'color_page_bg_sp',
        'color_content_bg_pc', 'color_content_bg_sp',
        'color_1', 'color_2', 'color_3',
        'page_post_layout_max_width_clm_1',
        'font_body', 'font_body_weight',
        'font_page', 'font_page_weight',
        'font_single', 'font_single_weight',
        'font_page_size_pc', 'font_page_size_tb', 'font_page_size_sp',
        'font_single_size_pc', 'font_single_size_tb', 'font_single_size_sp',
        'lw_extensions_seo_functions_switch',
        'lw_extensions_mail_form_switch_all',
        'lw_extensions_comment_functions_switch',
        'notification_paid_features'
    ];

    foreach ($common_theme_mod_keys as $key) {
        wp_cache_delete('lw_theme_mod_' . $key, 'lw_theme_mods');
    }

    // CSS変数とフォント設定のトランジェントキャッシュを削除
    lw_clear_css_transients();
}
add_action('customize_save_after', 'lw_clear_theme_mods_cache');

// CSS変数とフォント設定のトランジェントキャッシュを削除する関数
function lw_clear_css_transients() {
    global $wpdb;

    // lw_css_vars_* と lw_font_sets_* のトランジェントを削除
    $wpdb->query(
        "DELETE FROM {$wpdb->options}
         WHERE option_name LIKE '_transient_lw_css_vars_%'
            OR option_name LIKE '_transient_timeout_lw_css_vars_%'
            OR option_name LIKE '_transient_lw_font_sets_%'
            OR option_name LIKE '_transient_timeout_lw_font_sets_%'"
    );
}

if ( ! defined( 'LW_EXPANSION_BASE' ) ) {
	define( 'LW_EXPANSION_BASE', (bool) get_option( 'lw_expansion_base_functions' ) );
}
//membership
if(LW_EXPANSION_BASE){
    get_template_part('./functions/membership/index');
}
function lw_premium_info_link(){
    return  "https://lite-word.com/yuryo-plan/";
}
get_template_part('./functions/template_redirect');//redirect
get_template_part('./functions/wp_base_set');//WordPress基本設定
get_template_part('./functions/lw_template_management/index');
get_template_part('./functions/menu');//ナビゲーションメニュー
get_template_part('./functions/widget/index');//ウィジェット
get_template_part('./functions/disable-emoji');//絵文字を有効にする
get_template_part('./functions/user_data/index');//ユーザー設定
get_template_part('./functions/customizer/index');//カスタマイザー
get_template_part('./functions/css_js_set/index');//CSSとJS読み込み
get_template_part('./functions/title_put');//fvタイトルなどの情報取得
get_template_part('./functions/lazy_loading');//画像の遅延読み込み
get_template_part('./functions/lw_premium_login/setup');//ショップURL設定
get_template_part('./functions/lw_premium_login/popup');//ショップログインポップアップ
// AIシステム（REST APIを使用するため、is_admin()の外で読み込む必要がある）
get_template_part('./functions/lw_ai_system/index');

if(is_admin()){
    get_template_part('./functions/noscript_message');//JSを利用していない場合のメッセージ
    // get_template_part('./functions/lw_setting/index');//ページテンプレセッティング関係
    get_template_part('./functions/category_set/category_edit');//カテゴリーの編集画面
    get_template_part('./functions/category_set/category_common_edit');//カテゴリー共通設定
    get_template_part('./functions/dashboard_top/index');//ダッシュボートTOPのページの見た目など
    get_template_part('./functions/manual/index');//マニュアルページ
    get_template_part('./functions/theme_update');//テーマアップデート
}
$notification_paid_features = Lw_theme_mod_set("notification_paid_features", "on");
if($notification_paid_features == "on"){
    get_template_part('./functions/lw_template_management/lw_check_trial_popup');//無料体験
}
//SEO
$lw_seo_functions = Lw_theme_mod_set("lw_extensions_seo_functions_switch", "off");
if($lw_seo_functions === "on" && LW_EXPANSION_BASE){
    get_template_part('./functions/301_redirect');
    get_template_part('./functions/seo/index');
    get_template_part('./functions/seo/head_put');
    
    // クラスファイルは常に読み込む（cronやAPI経由でも必要）
    require_once get_template_directory() . '/functions/seo/sitemap_control_functions.php';
    if(defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true){
        require_once get_template_directory() . '/functions/seo/sitemap_settings_class.php';
        
        // Ajax処理はwp_ajax_アクションで自動的に管理画面のみで実行される
        require_once get_template_directory() . '/functions/seo/sitemap_ajax_hooks.php';
    }
}
get_template_part('./functions/seo/google');//Google アクセス解析系
if(defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true){
    get_template_part('./functions/json-ld/index');//JSON-LD（管理画面でもプレビュー表示のため読み込む）
}
//mail_form
$mail_form_switch_all = Lw_theme_mod_set("lw_extensions_mail_form_switch_all", "on");
if($mail_form_switch_all === "on"){
    get_template_part('./functions/mail_form/index');
}
$lw_comment_functions = Lw_theme_mod_set("lw_extensions_comment_functions_switch", "off");
if($lw_comment_functions === "on" && LW_EXPANSION_BASE){
    get_template_part('./functions/comment/index');//コメント機能
}
get_template_part('./functions/custom_post/index');//カスタム投稿タイプ系
get_template_part('./functions/front_page_setting');//フロントページ設定API
get_template_part('./functions/save_template');//テンプレートの保存
get_template_part('./functions/share_buttons');//シェアボタン
get_template_part('./functions/lw_my_parts/index');//LWマイパーツ
get_template_part('./functions/lw_page_template_insert/index');//LWページテンプレート挿入
get_template_part('./functions/custom_bloc_insert_system/index');//custom_bloc_insert_system
get_template_part('./functions/page-setting-wizard/index');//page-setting-wizard

//ショップURL
function lw_shop_url(){
    return  "https://shop.lite-word.com//user_login?my_home=".home_url();//本番用
}
//カスタムブロック
include( get_theme_file_path('/my-blocks/block-registration/register-wdl-block.php'));
get_template_part('./my-blocks/block-registration/block_category_set');
//jsにパスを通す
function rw_localize_theme_settings() {
    ?>
    <script type="text/javascript">
        var MyThemeSettings = {
            theme_Url: '<?php echo esc_js(get_template_directory_uri()); ?>',
            home_Url: '<?php echo esc_js(home_url()); ?>',
        };
    </script>
    <?php
}
// フロントエンド用の設定を wp_head に渡す
add_action('wp_head', 'rw_localize_theme_settings');
// ブロックエディタ用の設定を渡す
add_action('enqueue_block_assets', 'rw_localize_theme_settings');
if(is_admin()){
    //カウントダウンタイマーのエディター用スクリプト
    get_template_part( "templates/deadline_setting/editor" );
    //管理画面の通知
    get_template_part('./functions/admin_notices/index');
}
//register_block_style
get_template_part('./functions/register_block_style/index');
//ブロッククリーンアップ（テーマ更新時に古いブロックを削除）
get_template_part('./functions/block_cleanup');
//その他関数
get_template_part('./functions/various_functions');
// ウーコマースのサポート宣言
add_action('after_setup_theme', 'woocommerce_support');
function woocommerce_support() {
  if (class_exists('WooCommerce')) {
    add_theme_support('woocommerce');
  }
}
//Mixed Contentエラーを防ぐ（httpsのページの場合のエラーです）-----------------------------------------------------
function force_https_for_media($content) {
    if (is_ssl()) { // ページがHTTPSで読み込まれている場合
        $content = str_replace("http://", "https://", $content); // 全てのHTTPリンクをHTTPSに置換
    }
    return $content;
}
add_filter('the_content', 'force_https_for_media'); // 投稿やページのコンテンツに適用
add_filter('wp_get_attachment_url', 'force_https_for_media'); // メディアのURLにも適用
add_filter('widget_text', 'force_https_for_media'); // ウィジェット内のテキストにも適用

// テーマ切り替え後に指定のURLへリダイレクトする -----------------------------------------------------
function redirect_after_theme_switch_js() {
    // 現在のページがテーマ切り替え画面の場合にのみスクリプトを追加
    if (isset($_GET['activated']) && is_admin()) {
        ?>
        <script type="text/javascript">
            // テーマ切り替え後に指定のURLへリダイレクト
            window.location.href = "<?php echo admin_url(); ?>";
        </script>
        <?php
    }
}
add_action('admin_notices', 'redirect_after_theme_switch_js');
