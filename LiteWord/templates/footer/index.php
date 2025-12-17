<?php 
if ( !defined( 'ABSPATH' ) ) exit; 
$footer_set_ptn_df = Lw_theme_mod_set("footer_set_ptn_df", "ptn_1");
if(is_page()){
    $ptn_set = Lw_put_text("footer_select");
    if(empty($ptn_set)){
        $ptn_set = Lw_theme_mod_set("footer_set_ptn_page", $footer_set_ptn_df);
    }
    get_template_part( "templates/footer/".$ptn_set."/index" );
}
else if(is_single()){
    get_template_part( "templates/footer/".Lw_theme_mod_set("footer_set_ptn_post", $footer_set_ptn_df)."/index" );
}
else if(is_archive()){
    get_template_part( "templates/footer/".Lw_theme_mod_set("footer_set_ptn_archive", $footer_set_ptn_df)."/index" );
}
else{
    get_template_part( "templates/footer/".$footer_set_ptn_df."/index" );
}
//ロゴのURLを固定ページごとにjsで変更する
$logo_footer_page_url = Lw_put_text("logo_footer_page_url");
if(!empty($logo_footer_page_url)):?>
<script>
    //.lw_footer_main .logo a のhrefを書き換え
    document.addEventListener('DOMContentLoaded', function() {
        const footerLogoLink = document.querySelector('.lw_footer_main .logo a');
        if (footerLogoLink) {
            footerLogoLink.href = "<?php echo esc_url($logo_footer_page_url); ?>";
        }
    });
</script>

<?php endif?>