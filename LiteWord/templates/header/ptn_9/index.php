<?php
if ( !defined( 'ABSPATH' ) ) exit;
/**
 * ヘッダーパターン9「受付案内と予約」（プレミアム限定・2026-11-07）
 * 上の段: ロゴ・メニュー（区切り線）・アクセス（枠のボタン）・予約（塗りのボタン＝共通のボタンの部品）。その下に受付時間の帯（時計のアイコン）。
 * 1080px 以下: ロゴ・☰ → 受付時間の帯 → 幅いっぱいの予約ボタン。
 * 予約ボタンは上の段（.cta_pc）と一番下（.cta_sp）に1つずつ出し、幅で出し分ける（帯をはさむので、同じボタンを並べ替えでは動かせない）。
 * 受付時間の帯は文字を入れたときだけ、アクセスのボタンはリンク先を入れたときだけ出す（間違った情報・行き先の無いリンクを既定で出さない）。
 */
$set_id = 'header_ptn_9_set';
// 受付時間の帯
$hours_text = Lw_theme_mod_set( "{$set_id}_hours_text", '' );
$hours_style = '';
$hours_bg_color = Lw_theme_mod_set( "{$set_id}_hours_bg_color", '' );
$hours_text_color = Lw_theme_mod_set( "{$set_id}_hours_text_color", '' );
if ( !empty( $hours_bg_color ) ) $hours_style .= 'background-color:' . $hours_bg_color . ';';
if ( !empty( $hours_text_color ) ) $hours_style .= 'color:' . $hours_text_color . ';';
// アクセスのボタン
$access_url = Lw_theme_mod_set( "{$set_id}_access_url", '' );
$show_access = Lw_theme_mod_set( "{$set_id}_access_switch", 'on' ) !== 'off' && !empty( $access_url );
$access_text = Lw_theme_mod_set( "{$set_id}_access_text", 'アクセス' );
// 予約のボタン（共通のボタンの部品に渡す既定。上の段と一番下で同じものを使う）
$cta_args = [
    "location" => "header",
    "ptn" => "ptn_9",
    "df_cta_btn_switch" => "on",
    "df_cta_btn_text" => "WEB予約",
    "df_cta_btn_link" => "#",
    "df_cta_btn_bg_color" => "var(--color-accent)",
    "df_cta_btn_text_color" => "#ffffff",
    "df_cta_btn_bd_color" => "var(--color-accent)",
    "df_cta_btn_border_radius" => "8",
];
?>
<header class="lw_header_main header_ptn_9" itemscope itemtype="http://schema.org/WPHeader">
    <?php lw_information_bar_put([
        "location" => "header",
        "ptn" => "ptn_9",
        "df_switch" => "off",
    ])?>
    <div class="inner">
        <div class="logo">
            <?php Lw_logo_set(
                [
                    "location" => "header",
                    "ptn" => "ptn_9",
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
        <nav class="header_nav" aria-label="メインナビゲーション" itemscope itemtype="http://schema.org/SiteNavigationElement">
            <?php Lw_header_menu_put([
                "location" => "header",
                "ptn" => "ptn_9",
                "df_menu_1st_layer_text_color" => "#333",
                "df_menu_current_text_color" => "",
                "df_menu_current_bg_color" => "var(--color-main)",
                "df_menu_1st_layer_hover_text_color" => "var(--color-main)",
                "df_menu_1st_layer_hover_bg_color" => "var(--color-main)",
            ]);?>
        </nav>
        <?php if ( $show_access ): ?>
        <a class="access_btn" href="<?= esc_url( $access_url ) ?>">
            <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg></span>
            <span class="text"><?= esc_html( $access_text ) ?></span>
        </a>
        <?php endif; ?>
        <div class="cta_pc"><?php Lw_cta_btn_1_set( $cta_args ); ?></div>
        <div class="ham_btn drawer_nav_open">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <?php if ( !empty( $hours_text ) ): ?>
    <div class="hours_band"<?php if ( $hours_style ): ?> style="<?= esc_attr( $hours_style ) ?>"<?php endif; ?>>
        <span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg></span>
        <p class="text"><?= esc_html( $hours_text ) ?></p>
    </div>
    <?php endif; ?>
    <div class="cta_sp"><?php Lw_cta_btn_1_set( $cta_args ); ?></div>
</header>
<?php Lw_follow_menu_put([
    "location" => "header",
    "ptn" => "ptn_9",
]);?>
