<?php 
if ( !defined( 'ABSPATH' ) ) exit; 
$drawer_set_ptn_df = Lw_theme_mod_set("drawer_set_ptn_df", "ptn_1");
// パターン名は形を確かめてから読む（lw_ptn_template_part()・various_functions.php）。
// 固定ページのメタに ../ などの形の違う値が入っていたら使わない（2026-11-02 再点検）
if(is_page()){
    $drawer_set_ptn_df = Lw_theme_mod_set("drawer_set_ptn_page", $drawer_set_ptn_df);
    $drawer_page_switch = Lw_put_text("drawer_page_switch", $drawer_set_ptn_df);
    if(lw_is_ptn_name($drawer_page_switch)){
        $drawer_set_ptn_df = $drawer_page_switch;
    }
    lw_ptn_template_part( 'drawer', Lw_theme_mod_set("drawer_set_ptn_page", $drawer_set_ptn_df) );
}
else if(is_single()){
    $drawer_set_ptn_df = Lw_theme_mod_set("drawer_set_ptn_post", $drawer_set_ptn_df);
    lw_ptn_template_part( 'drawer', Lw_theme_mod_set("drawer_set_ptn_post", $drawer_set_ptn_df) );
}
else if(is_archive()){
    $drawer_set_ptn_df = Lw_theme_mod_set("drawer_set_ptn_archive", $drawer_set_ptn_df);
    lw_ptn_template_part( 'drawer', Lw_theme_mod_set("drawer_set_ptn_archive", $drawer_set_ptn_df) );
}
else{
    lw_ptn_template_part( 'drawer', $drawer_set_ptn_df );
}