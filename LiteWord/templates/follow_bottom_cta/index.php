<?php 
if ( !defined( 'ABSPATH' ) ) exit;
$ptn_switch = Lw_theme_mod_set("follow_bottom_cta_set_ptn_df","none");
if(is_page()){
    $ptn_switch = Lw_theme_mod_set("follow_bottom_cta_set_ptn_page", $ptn_switch);
}
else if(is_single()){
    $ptn_switch = Lw_theme_mod_set("follow_bottom_cta_set_ptn_post", $ptn_switch);
}
else if(is_archive()){
    $ptn_switch = Lw_theme_mod_set("follow_bottom_cta_set_ptn_archive", $ptn_switch);
}
$ptn =  Lw_put_text("follow_bottom_cta_ptn",$ptn_switch);
if($ptn === "none") return;
get_template_part("./templates/follow_bottom_cta/{$ptn}/index");  
?>
<script>
'use strict';
{
    // ページのスクロールイベント
    window.addEventListener('scroll', () => {
        const followCta = document.querySelector('.follow_bottom_cta');
        if (!followCta) return; // .follow_bottom_ctaが存在しない場合は処理を終了

        const scrollY = window.scrollY; // 現在のスクロール位置
        const scrollHeight = document.documentElement.scrollHeight; // ページ全体の高さ
        const clientHeight = document.documentElement.clientHeight; // ウィンドウの高さ

        // トップから200px下で .true を付与
        if (scrollY > 200) {
            followCta.classList.add('true');
        } else {
            followCta.classList.remove('true');
        }

        // 一番下から100px以内で .true を削除
        if (scrollY + clientHeight >= scrollHeight - 100) {
            followCta.classList.remove('true');
        }
    });
}
</script>
