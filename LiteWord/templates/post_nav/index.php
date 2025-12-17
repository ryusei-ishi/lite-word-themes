<?php
/* ============================================================
 * 前後ナビゲーション（LiteWord）
 *  - 前記事が無い & 次記事がある ⇒ カテゴリー一覧リンク
 *  - 前記事が有り & 次記事が無い ⇒ <ul> に .prev_only 付与
 *  - 両方無い ⇒ ナビゲーション自体を出力しない
 * ========================================================= */
$prev_post = get_previous_post( true );   // 前
$next_post = get_next_post( true );       // 次

$prev_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>';
$next_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>';

/* --- カテゴリー情報（前記事なし時の代替リンク） --- */
$categories = get_the_category();
$cat_link   = $categories ? get_category_link( $categories[0]->term_id ) : '';
$cat_name   = $categories ? esc_html( $categories[0]->name ) : __( '一覧', 'liteword' );

/* --- 前後どちらかが存在する場合のみ描画 --- */
if ( $prev_post || $next_post ) :

	/* UL クラス判定：前のみ存在＝.prev_only 追加 */
	$ul_class = 'lw_post_nav_list';
	if ( $prev_post && ! $next_post ) {
		$ul_class .= ' prev_only';
	}
	?>
	<nav class="lw_post_nav" aria-label="投稿ナビゲーション">
		<ul class="<?php echo esc_attr( $ul_class ); ?>">

			<!-- ===== 前リンク ===== -->
			<li class="post_nav_prev">
				<?php
				if ( $prev_post ) {
					/* 前記事がある */
					previous_post_link(
						'%link',
						$prev_icon . '<span class="post_nav_title">%title</span>',
						true
					);
				} elseif ( $cat_link ) {
					/* 前記事が無く次記事がある ⇒ カテゴリー一覧 */
					echo '<a href="' . esc_url( $cat_link ) . '" rel="prev">' .
						 $prev_icon .
						 '<span class="post_nav_title">' . $cat_name . '</span>' .
						 '</a>';
				}
				?>
			</li>

			<!-- ===== 次リンク（存在するときだけ） ===== -->
			<?php if ( $next_post ) : ?>
				<li class="post_nav_next">
					<?php
					next_post_link(
						'%link',
						'<span class="post_nav_title">%title</span>' . $next_icon,
						true
					);
					?>
				</li>
			<?php endif; ?>

		</ul>
	</nav>
<?php endif; ?>
