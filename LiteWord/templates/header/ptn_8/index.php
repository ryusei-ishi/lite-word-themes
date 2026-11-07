<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * ヘッダーパターン8「ショップ」（プレミアム限定・2026-11-07）
 * 上の段: ロゴ・検索窓・マイページとカート（線のアイコンと文字）。下の段: カテゴリ（ヘッダーのメニュー）。
 * 1080px 以下: 上の段はロゴ・カート・☰、その下に検索窓（同じフォームを CSS の order で下へ回す）。カテゴリはドロワーで出す。
 * マイページとカートの行き先は「設定の URL → WooCommerce の画面」の順。どちらも無いときはアイコンを出さない（行き先の無いリンクを作らない）。
 */
$set_id = 'header_ptn_8_set';
$has_wc = class_exists( 'WooCommerce' );

// 検索窓（WooCommerce を使っていれば、既定は商品だけを探す）
$search_placeholder = Lw_theme_mod_set( "{$set_id}_search_placeholder", '商品を探す' );
$search_target = Lw_theme_mod_set( "{$set_id}_search_target", 'auto' );
$search_product = $has_wc && in_array( $search_target, [ 'auto', 'product' ], true );

// マイページ・カート
$shop_links = [];
$wc_urls = [
    'mypage' => ( $has_wc && function_exists( 'wc_get_page_permalink' ) ) ? wc_get_page_permalink( 'myaccount' ) : '',
    'cart'   => ( $has_wc && function_exists( 'wc_get_cart_url' ) ) ? wc_get_cart_url() : '',
];
foreach ( [ 'mypage' => 'マイページ', 'cart' => 'カート' ] as $key => $df_text ) {
    if ( Lw_theme_mod_set( "{$set_id}_{$key}_switch", 'on' ) === 'off' ) continue;
    $url = Lw_theme_mod_set( "{$set_id}_{$key}_url", '' );
    if ( empty( $url ) ) $url = $wc_urls[ $key ];
    if ( empty( $url ) ) continue;
    $shop_links[ $key ] = [ 'text' => Lw_theme_mod_set( "{$set_id}_{$key}_text", $df_text ), 'url' => $url ];
}
// 線のアイコン（線の色は文字の色に合わせる）
$shop_icons = [
    'mypage' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
    'cart'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4h2.3l2.3 10.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.5L20.8 7H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="17.2" cy="20" r="1.4"/></svg>',
];
?>
<header class="lw_header_main header_ptn_8" itemscope itemtype="http://schema.org/WPHeader">
    <?php lw_information_bar_put([
        "location" => "header",
        "ptn" => "ptn_8",
        "df_switch" => "off",
    ])?>
    <div class="inner">
        <div class="logo">
            <?php Lw_logo_set(
                [
                    "location" => "header",
                    "ptn" => "ptn_8",
                    "df_logo_switch" => "logo_img",
                    "df_logo_text_color" => "#111",
                    "df_logo_text_font" => "mincho",
                    "df_logo_text_size_pc" => "26",
                    "df_logo_text_size_tb" => "22",
                    "df_logo_text_size_sp" => "20",
                    "df_logo_img_size_pc" => "36",
                    "df_logo_img_size_tb" => "32",
                    "df_logo_img_size_sp" => "28",
                ]
            ); ?>
        </div>
        <form class="search_form" role="search" method="get" action="<?= esc_url( home_url( '/' ) ) ?>">
            <div class="search_box">
                <button type="submit" class="search_btn" aria-label="検索">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>
                </button>
                <input type="search" name="s" value="<?= esc_attr( get_search_query() ) ?>" placeholder="<?= esc_attr( $search_placeholder ) ?>" aria-label="<?= esc_attr( $search_placeholder ) ?>">
            </div>
            <?php if ( $search_product ): ?>
            <input type="hidden" name="post_type" value="product">
            <?php endif; ?>
        </form>
        <?php if ( !empty( $shop_links ) ): ?>
        <div class="shop_links">
            <?php foreach ( $shop_links as $key => $link ): ?>
            <a class="shop_link <?= esc_attr( $key ) ?>" href="<?= esc_url( $link['url'] ) ?>" aria-label="<?= esc_attr( $link['text'] ) ?>">
                <span class="icon" aria-hidden="true"><?= $shop_icons[ $key ] ?></span>
                <span class="label"><?= esc_html( $link['text'] ) ?></span>
            </a>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        <div class="ham_btn drawer_nav_open">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <nav class="header_nav" aria-label="カテゴリ" itemscope itemtype="http://schema.org/SiteNavigationElement">
        <?php Lw_header_menu_put([
            "location" => "header",
            "ptn" => "ptn_8",
            "df_menu_1st_layer_text_color" => "#222",
            "df_menu_current_text_color" => "",
            "df_menu_current_bg_color" => "var(--color-main)",
            "df_menu_1st_layer_hover_text_color" => "var(--color-main)",
            "df_menu_1st_layer_hover_bg_color" => "var(--color-main)",
        ]);?>
    </nav>
</header>
<?php Lw_follow_menu_put([
    "location" => "header",
    "ptn" => "ptn_8",
]);?>
