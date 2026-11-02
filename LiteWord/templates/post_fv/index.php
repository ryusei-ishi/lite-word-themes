<?php
/*
 * 投稿の FV（ファーストビュー）のパターンを読み込む。
 * 🚨 パターン名は投稿メタ fv_select（寄稿者・投稿者も自分の投稿に書ける）とカテゴリーのメタから来る。
 *    get_template_part() にそのまま渡すと ../ で別の場所のファイルを読ませられる（2026-11-02 の点検 T7）。
 *    「fv_ptn_ で始まる英数字」かつ「テーマ（子テーマを含む）に本当にあるパターン」だけを読む。
 */
$lw_post_fv_is_valid = static function ( $ptn ) {
    $ptn = (string) $ptn;
    if ( ! preg_match( '/^fv_ptn_[a-z0-9_]+$/', $ptn ) ) {
        return false;
    }
    return '' !== locate_template( "templates/post_fv/{$ptn}/index.php" );
};

$category = get_the_category(); // 現在の投稿のカテゴリーを取得
$ptn_select_category = "";
if ($category) {
    $category_id = $category[0]->term_id; // 最初のカテゴリーのIDを取得
    $ptn_select_category = get_term_meta($category_id, 'category_post_fv_ptn', true); // メタデータを取得
}
// カテゴリーのFVパターンが設定されている場合
if(!empty($ptn_select_category) && $lw_post_fv_is_valid($ptn_select_category)){
    get_template_part("templates/post_fv/$ptn_select_category/index");
    return;
}
// カテゴリーのFVパターンが設定されていない場合
$ptn_select_df = Lw_theme_mod_set("single_post_layout_fv_ptn", "fv_ptn_1");
$ptn_select = Lw_put_text("fv_select","$ptn_select_df");
if ( ! $lw_post_fv_is_valid( $ptn_select ) ) {
    $ptn_select = $lw_post_fv_is_valid( $ptn_select_df ) ? $ptn_select_df : 'fv_ptn_1';
}
get_template_part("templates/post_fv/$ptn_select/index");
