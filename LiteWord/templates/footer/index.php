<?php 
if ( !defined( 'ABSPATH' ) ) exit; 
$footer_set_ptn_df = Lw_theme_mod_set("footer_set_ptn_df", "ptn_1");
// パターン名は形を確かめてから読む（lw_ptn_template_part()・various_functions.php）。
// 固定ページのメタに ../ などの形の違う値が入っていたら「未選択」と同じ扱い（2026-11-02 再点検）
if(is_page()){
    $ptn_set = Lw_put_text("footer_select");
    if(!lw_is_ptn_name($ptn_set)){
        $ptn_set = '';
    }
    if(empty($ptn_set)){
        $ptn_set = Lw_theme_mod_set("footer_set_ptn_page", $footer_set_ptn_df);
    }
    lw_ptn_template_part( 'footer', $ptn_set );
}
else if(is_single()){
    lw_ptn_template_part( 'footer', Lw_theme_mod_set("footer_set_ptn_post", $footer_set_ptn_df) );
}
else if(is_archive()){
    lw_ptn_template_part( 'footer', Lw_theme_mod_set("footer_set_ptn_archive", $footer_set_ptn_df) );
}
else{
    lw_ptn_template_part( 'footer', $footer_set_ptn_df );
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