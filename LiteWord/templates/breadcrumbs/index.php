<?php 
if ( !defined( 'ABSPATH' ) ) exit;
get_template_part('./functions/breadcrumb'); //関数
$ptn = "ptn_2";
//投稿ページの場合
if(is_single()){
    get_template_part('./templates/single_post_layout');
    $ptn = Lw_theme_mod_set("single_post_layout_breadcrumb_ptn","ptn_1");
}
if($ptn === "none") return;
?>
<div class="breadcrumbs_wrap <?=$ptn?>">
    <?php put_breadcrumbs()?>
</div>