<?php if ( !defined( 'ABSPATH' ) ) exit; ?>
<link rel="stylesheet" href="<?=get_template_directory_uri()?>/templates/footer/ptn_1/style.css">
<footer class="lw_footer_main footer_ptn_1">
    <?php 
        // ウィジェット
        $widget_switch = Lw_theme_mod_set("footer_ptn_1_set_widget_switch", "off");
        if($widget_switch === "on") get_template_part( 'templates/footer/widget' );
    
    ?>
    <?php Lw_sns_icon_1_set([
        "location" => "footer",
        "ptn" => "ptn_1",
        "number_of_items" => "4",
    ])?>
    <?php Lw_copyright_1_set([
        "location" => "footer",
        "ptn" => "ptn_1",
        "color_text" => "#000",
    ])?>
</footer>
