<?php
if ( !defined( 'ABSPATH' ) ) exit; 
 $description = get_bloginfo('description');
?>
<header class="lw_header_main header_ptn_5" itemscope itemtype="http://schema.org/WPHeader">
    <?php lw_information_bar_put([
        "location" => "header",
        "ptn" => "ptn_5",
        "df_switch" => "off",
    ])?>
    <div class="inner">
        <div class="logo">
            <?php Lw_logo_set(
                [
                    "location" => "header",
                    "ptn" => "ptn_5",
                    "df_logo_switch" => "logo_img",
                    "df_logo_text_color" => "#111",
                    "df_logo_text_font" => "mincho",
                    "df_logo_text_size_pc" => "30",
                    "df_logo_text_size_tb" => "34",
                    "df_logo_text_size_sp" => "38",
                    "df_logo_img_size_pc" => "30",
                    "df_logo_img_size_tb" => "34",
                    "df_logo_img_size_sp" => "38",
                ]
            ); ?>
        </div>
        <?php 
            $explanation_pc = Lw_theme_mod_set("header_ptn_5_set_explanation_pc","");
            if(!empty($explanation_pc)){
                // $explanation_pcを改行させる
                $explanation_pc = str_replace("\n", "<br>", $explanation_pc);
                echo '<p class="explanation pc">'.$explanation_pc.'</p>';
            }
            //spの時も同じ
            $explanation_sp = Lw_theme_mod_set("header_ptn_5_set_explanation_sp","");
            if(!empty($explanation_sp)){
                // $explanation_spを改行させる
                $explanation_sp = str_replace("\n", "<br>", $explanation_sp);
                echo '<p class="explanation sp">'.$explanation_sp.'</p>';
            }
        ?>
        <div class="ham_btn drawer_nav_open">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <nav class="header_nav" aria-label="メインナビゲーション" itemscope itemtype="http://schema.org/SiteNavigationElement">
        <?php  Lw_header_menu_put([
            "location" => "header",
            "ptn" => "ptn_5",
            "df_menu_current_text_color" => "",
            "df_menu_current_bg_color" => "",
            "df_menu_1st_layer_hover_text_color" => "#555",
            "df_menu_1st_layer_hover_bg_color" => "var(--color-accent)",
        ]);?>

    </nav>
    <?php
        $pickup_menu_switch = "off";
        //メニューの項目が設定されているかの判断
        $pickup_menu_bg_color = Lw_theme_mod_set("header_ptn_5_set_pickup_menu_bg_color","var(--color-main)");
        for ($i=1; $i <= 4; $i++) { 
            $pickup_menu_text = Lw_theme_mod_set("header_ptn_5_set_pickup_menu_{$i}_text","");
            if(!empty($pickup_menu_text)){
                $pickup_menu_switch = 'on';
                break;
            }
        }
        //どのページに表示するかの判断
        $pickup_menu_page_switch = Lw_theme_mod_set("header_ptn_5_set_pickup_menu_page_switch","all");
        //top_onlyはトップページのみ表示する
        if($pickup_menu_page_switch == 'top_only'){
            if(!is_front_page()){
                $pickup_menu_switch = 'off';
            }
        }elseif($pickup_menu_page_switch == 'page_only'){
            if(!is_page()){
                $pickup_menu_switch = 'off';
            }
        }elseif($pickup_menu_page_switch == 'page_none'){
            if(is_page()){
                $pickup_menu_switch = 'off';
            }
        }elseif($pickup_menu_page_switch == 'single_only'){
            if(!is_single()){
                $pickup_menu_switch = 'off';
            }
        }elseif($pickup_menu_page_switch == 'single_none'){
            if(is_single()){
                $pickup_menu_switch = 'off';
            }
        }elseif($pickup_menu_page_switch == 'archive_only'){
            if(!is_archive()){
                $pickup_menu_switch = 'off';
            }
        }elseif($pickup_menu_page_switch == 'archive_none'){
            if(is_archive()){
                $pickup_menu_switch = 'off';
            }
        }elseif($pickup_menu_page_switch == 'all'){
            //全てのページに表示するので何もしない
        }elseif($pickup_menu_page_switch == 'off'){
            $pickup_menu_switch = 'off';
        }
        //ページ独自の表示の判断
        $page_pickup_menu_page_switch = Lw_put_text("page_pickup_menu_page_switch", "");
        if($page_pickup_menu_page_switch == 'on'){
            $pickup_menu_switch = 'on';
        }elseif($page_pickup_menu_page_switch == 'off'){
            $pickup_menu_switch = 'off';
        }

        if($pickup_menu_switch == 'on'):
        $pickup_menu_responsive_class = Lw_theme_mod_set("header_ptn_5_set_pickup_menu_responsive","sp_pc");
    ?>
    <nav class="header_nav_sub <?=$pickup_menu_responsive_class?>" style="background-color:<?=$pickup_menu_bg_color?>">
        <ul>
            <?php
                for ($i=1; $i <= 4; $i++) :
                    $pickup_menu_text = Lw_theme_mod_set("header_ptn_5_set_pickup_menu_{$i}_text","");
                    $pickup_menu_url = Lw_theme_mod_set("header_ptn_5_set_pickup_menu_{$i}_url","");
                    $pickup_menu_icon = Lw_theme_mod_set("header_ptn_5_set_pickup_menu_{$i}_icon","");
                    if(!empty($pickup_menu_text)):
            ?>
                <li>
                    <a href="<?=$pickup_menu_url?>">
                        <?php if(!empty($pickup_menu_icon) && $pickup_menu_icon !== "none"):?>
                        <div class="icon"><?php get_template_part('./assets/image/icon/'.$pickup_menu_icon) ?></div>
                        <?php endif; ?>
                        <div class="text"><?=$pickup_menu_text?></div>
                    </a>
                </li>
            <?php endif;endfor; ?>
        </ul>
    </nav>
    <?php endif; ?>
    <style>
        .header_ptn_5 .header_nav_sub ul li a .icon svg,
        .header_ptn_5 .header_nav_sub ul li a .icon svg path{
            fill: <?=$pickup_menu_bg_color?>;

        }
    </style>
</header>
<?php Lw_follow_menu_put([
    "location" => "header",
    "ptn" => "ptn_5",
]);?>
