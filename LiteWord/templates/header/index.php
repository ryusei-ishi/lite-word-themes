<?php
if ( !defined( 'ABSPATH' ) ) exit; 
$header_set_ptn_df = Lw_theme_mod_set("header_set_ptn_df", "ptn_1");
if(is_page()){
    $ptn_set = Lw_put_text("header_select");
    if(empty($ptn_set)){
        $ptn_set = Lw_theme_mod_set("header_set_ptn_page", $header_set_ptn_df);
    }
    get_template_part( "templates/header/".$ptn_set."/index" );
}
else if(is_single()){
    get_template_part( "templates/header/".Lw_theme_mod_set("header_set_ptn_post", $header_set_ptn_df)."/index" );
}
else if(is_archive()){
    get_template_part( "templates/header/".Lw_theme_mod_set("header_set_ptn_archive", $header_set_ptn_df)."/index" );
}
else{
    get_template_part( "templates/header/".$header_set_ptn_df."/index" );
}

//ヘッダー追従設定
if(!empty($ptn_set)){
    $header_follow_switch = Lw_theme_mod_set("header_{$ptn_set}_set_follow_switch", "off");
}else{
    $header_follow_switch = Lw_theme_mod_set("header_{$header_set_ptn_df}_set_follow_switch", "off");
}
if($header_follow_switch == "on" || $header_follow_switch == "on_pc_menu_1"){
    get_template_part( "templates/header/follow_on" );
}
//ロゴのURLを固定ページごとにjsで変更する
$logo_header_page_url = Lw_put_text("logo_header_page_url");
if(!empty($logo_header_page_url)):?>
<script>
    //.lw_header_main .logo a のhrefを書き換え
    document.addEventListener('DOMContentLoaded', function() {
        const headerLogoLink = document.querySelector('.lw_header_main .logo a');
        if (headerLogoLink) {
            headerLogoLink.href = "<?php echo esc_url($logo_header_page_url); ?>";
        }
    });
</script>

<?php endif?>