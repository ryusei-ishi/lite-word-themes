<?php
    $location = 'drawer';
    $ptn = 'ptn_1';
    $class = ".{$location}_{$ptn}_set";
    $set_id = "{$location}_{$ptn}_set";
    $menu_select = Lw_theme_mod_set("{$set_id}_menu_select");
    $menu_select = Lw_put_text("drawer_menu_select", $menu_select);
    $menu_font = Lw_theme_mod_set("{$set_id}_menu_font");
    $menu_1st_layer_text_color = Lw_theme_mod_set("{$set_id}_menu_1st_layer_text_color");
    $menu_1st_layer_bg_color = Lw_theme_mod_set("{$set_id}_menu_1st_layer_bg_color" , "var(--color-main)");
    $menu_2st_layer_text_color = Lw_theme_mod_set("{$set_id}_menu_2st_layer_text_color");
    $menu_2st_layer_bg_color = Lw_theme_mod_set("{$set_id}_menu_2st_layer_bg_color");
?>
<style>
    .drawer_nav{
        position: fixed;
        top: 0;
        left: -100%;
        z-index: 9999999;
        height: 100%;
        width: calc(100% - 88px);
        max-width: 600px;
        display: block;
        background: #fff;
        visibility: hidden;
        opacity: 0;
        transition: 0.5s;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    @media (max-width: 500px) {
        .drawer_nav{
            width: calc(100% - 68px);
        }
    }
    <?=$class?>.drawer_nav ul.menu_sp>li>a {
        color: <?=$menu_1st_layer_text_color?>;
        background-color: <?=$menu_1st_layer_bg_color?>;
    }
    <?=$class?>.drawer_nav .down_btn>div{
        background-color: <?=$menu_1st_layer_bg_color?>;
    }
    <?=$class?>.drawer_nav ul.menu_sp>li ul.sub-menu li a{
        color: <?=$menu_2st_layer_text_color?>;
        background-color: <?=$menu_2st_layer_bg_color?>;
    }
</style>


<div class="drawer_nav <?=$set_id?>" itemscope="" itemtype="https://schema.org/SiteNavigationElement" aria-label="Drawer navigation">
    <div class="inner">
        <nav class="menu">
            <?php wp_nav_menu(
                array (
                    'menu' => !empty($menu_select) ? $menu_select : null, // `$menu_select` が設定されている場合のみ `menu` を指定
                    'theme_location' => empty($menu_select) ? $location : null, // `$menu_select` が `null` の場合に `theme_location` を設定
                    'container' => false,
                    'fallback_cb' => false,
                    'items_wrap' => '<ul data-lw_font_set="'.$menu_font.'" class="menu_sp">%3$s</ul>',
                    )
            ); ?>
            <?php Lw_cta_btn_1_set([
                "location" => "drawer",
                "ptn" => "ptn_1",
                "class" => "drawer_ptn_1_set",
                "df_cta_btn_switch" => "off",
                "df_cta_btn_text" => "ご予約はこちら",
                "df_cta_btn_link" => "#",
                "df_cta_btn_bg_color" => "var(--color-accent)",
                "df_cta_btn_text_color" => "#ffffff",
                "df_cta_btn_border_radius" => "100",
            ])?>
        </nav>
        <?php if (is_active_sidebar('drawer-menu-widget-area')) : ?>
            <div id="drawer-menu-widget-area" class="drawer-menu-widget-area">
                <?php dynamic_sidebar('drawer-menu-widget-area'); ?>
            </div>
        <?php endif; ?>
        <?php get_template_part('templates/drawer/widget') ?>
    </div>
</div>
<div class="drawer_nav_filter drawer_nav_open"></div>
