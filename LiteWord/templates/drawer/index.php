<?php 
if ( !defined( 'ABSPATH' ) ) exit; 
$drawer_set_ptn_df = Lw_theme_mod_set("drawer_set_ptn_df", "ptn_1");
if(is_page()){
    $drawer_set_ptn_df = Lw_theme_mod_set("drawer_set_ptn_page", $drawer_set_ptn_df);
    $drawer_set_ptn_df = Lw_put_text("drawer_page_switch", $drawer_set_ptn_df);
    get_template_part( "templates/drawer/".Lw_theme_mod_set("drawer_set_ptn_page", $drawer_set_ptn_df)."/index" );
}
else if(is_single()){
    $drawer_set_ptn_df = Lw_theme_mod_set("drawer_set_ptn_post", $drawer_set_ptn_df);
    get_template_part( "templates/drawer/".Lw_theme_mod_set("drawer_set_ptn_post", $drawer_set_ptn_df)."/index" );
}
else if(is_archive()){
    $drawer_set_ptn_df = Lw_theme_mod_set("drawer_set_ptn_archive", $drawer_set_ptn_df);
    get_template_part( "templates/drawer/".Lw_theme_mod_set("drawer_set_ptn_archive", $drawer_set_ptn_df)."/index" );
}
else{
    get_template_part( "templates/drawer/".$drawer_set_ptn_df."/index" );
}