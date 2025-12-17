<?php
/**
 * カテゴリー共通設定の内容を出力（FV下用）
 *  ─ カテゴリー・投稿一覧ページ（is_home）だけに限定
 */
function lw_the_category_common_content() {

	/* ── 表示条件 ────────────────────────────
	 * 1) カテゴリーアーカイブ   : is_category()
	 * 2) 投稿一覧用の固定ページ : is_home() && ! is_front_page()
	 *    （設定 ▸ 表示設定 で「投稿ページ」に割り当てた固定ページ）
	 */
	if ( ! ( is_category() || ( is_home() && ! is_front_page() ) ) ) {
		return; // 条件外なら出力しない
	}

	// ▼ ここから従来どおり
	$content = get_option( 'lw_cat_common_content_fv_bottom', '' );
	if ( empty( $content ) ) {
		return;
	}

	$content = apply_filters( 'the_content', $content );
	?>
	<section class="lw_cat_common_content_fv_bottom post_style">
		<div class="first_content"></div>
			<?= $content; ?>
		<div class="last_content"></div>
	</section>
	<?php
}
lw_the_category_common_content();