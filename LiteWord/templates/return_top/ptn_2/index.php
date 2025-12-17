<?php
    if ( !defined( 'ABSPATH' ) ) exit;
    $color_accent = Lw_theme_mod_set("return_top_ptn_2_set_color_main", "var(--color-accent)");
    $color_return_btn = lw_put_text("color_return_btn",$color_accent);
    if($color_return_btn === "#ada993"){
        $color_return_btn = $color_accent;
    }
?>
<div id="return_top" class="top_return ptn_2" style="background:<?=$color_return_btn?>;"></div>
