<?php
if ( !defined( 'ABSPATH' ) ) exit; 
$header_set_ptn_df = Lw_theme_mod_set("header_set_ptn_df", "ptn_1");
// パターン名は形を確かめてから読む（lw_ptn_template_part()・various_functions.php）。
// 固定ページのメタに ../ などの形の違う値が入っていたら「未選択」と同じ扱い（2026-11-02 再点検）
if(is_page()){
    $ptn_set = Lw_put_text("header_select");
    if(!lw_is_ptn_name($ptn_set)){
        $ptn_set = '';
    }
    if(empty($ptn_set)){
        $ptn_set = Lw_theme_mod_set("header_set_ptn_page", $header_set_ptn_df);
    }
    lw_ptn_template_part( 'header', $ptn_set );
}
else if(is_single()){
    lw_ptn_template_part( 'header', Lw_theme_mod_set("header_set_ptn_post", $header_set_ptn_df) );
}
else if(is_archive()){
    lw_ptn_template_part( 'header', Lw_theme_mod_set("header_set_ptn_archive", $header_set_ptn_df) );
}
else{
    lw_ptn_template_part( 'header', $header_set_ptn_df );
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