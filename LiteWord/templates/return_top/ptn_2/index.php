<?php
    if ( !defined( 'ABSPATH' ) ) exit;
    $color_accent = Lw_theme_mod_set("return_top_ptn_2_set_color_main", "var(--color-accent)");
    $color_return_btn = lw_put_text("color_return_btn",$color_accent);
    // 色の形でなければカスタマイザーの色（style 属性にそのまま入るため。2026-11-02 再チェック R1）
    if($color_return_btn === "#ada993" || ($color_return_btn !== $color_accent && !lw_is_safe_css_color($color_return_btn))){
        $color_return_btn = $color_accent;
    }
?>
<div id="return_top" class="top_return ptn_2" style="background:<?=esc_attr($color_return_btn)?>;"></div>
