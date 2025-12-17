<?php
$category = get_the_category(); // 現在の投稿のカテゴリーを取得
$ptn_select_category = ""; 
if ($category) {
    $category_id = $category[0]->term_id; // 最初のカテゴリーのIDを取得
    $ptn_select_category = get_term_meta($category_id, 'category_post_fv_ptn', true); // メタデータを取得
}
// カテゴリーのFVパターンが設定されている場合
if(!empty($ptn_select_category)){
    get_template_part("templates/post_fv/$ptn_select_category/index");
    return;
}
// カテゴリーのFVパターンが設定されていない場合
$ptn_select_df = Lw_theme_mod_set("single_post_layout_fv_ptn", "fv_ptn_1");
$ptn_select = Lw_put_text("fv_select","$ptn_select_df");
get_template_part("templates/post_fv/$ptn_select/index"); 