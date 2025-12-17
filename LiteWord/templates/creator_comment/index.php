<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ----------------------------------------------------------------------
 * ページコメント機能 ON/OFF（カスタムフィールドなどで制御）
 * -------------------------------------------------------------------- */
$page_comment = Lw_put_text( 'page_comment' );
if ( empty( $page_comment ) || $page_comment === 'off' ) {
	return; // OFF のときは何も出力しない
}

/* ----------------------------------------------------------------------
 * CSS 読み込み
 * -------------------------------------------------------------------- */
wp_enqueue_style(
	'lw_comment_style',
	get_template_directory_uri() . '/templates/creator_comment/css/style.min.css',
	[],
	css_version(),
	'all'
);

/* ----------------------------------------------------------------------
 * 著者情報
 * -------------------------------------------------------------------- */
// 著者 ID（固定ページでも OK）
$author_id = (int) get_post_field( 'post_author', get_queried_object_id() );
if ( ! $author_id ) {
	$author_id = 1; // フォールバック
}

// 表示名
$author_name = get_the_author_meta( 'display_name', $author_id );
if ( empty( $author_name ) ) {
	$author_name = 'クリエイター';
}

// プロフィール「サイト」URL（user_url → なければ著者アーカイブ）
$profile_site_url = get_the_author_meta( 'user_url', $author_id );
if ( empty( $profile_site_url ) ) {
	$profile_site_url = get_author_posts_url( $author_id );
}
if ( empty( $profile_site_url ) ) {
	$profile_site_url = false; // どちらも無い場合はリンク非表示
}

/* ----------------------------------------------------------------------
 * アバター画像（優先順位：LWプロフィール画像 > Gravatar > No Image）
 * -------------------------------------------------------------------- */
$profile_image = get_user_meta( $author_id, 'profile_image', true ); // LW 独自

if ( $profile_image ) {
	$author_avatar_html = sprintf(
		'<img src="%s" alt="%s" class="avatar avatar-128 photo" width="128" height="128" loading="lazy">',
		esc_url( $profile_image ),
		esc_attr( $author_name )
	);
} else {
	$gravatar_url = get_avatar_url( $author_id, [ 'size' => 128 ] );

	if ( $gravatar_url ) {
		$author_avatar_html = sprintf(
			'<img src="%s" alt="%s" class="avatar avatar-128 photo" width="128" height="128" loading="lazy">',
			esc_url( $gravatar_url ),
			esc_attr( $author_name )
		);
	} else {
		$author_avatar_html = '<div class="no_avatar">No Image</div>';
	}
}
?>

<div class="creator_comment_footer_bottom" role="complementary" aria-labelledby="creator-comment-heading">
	<div class="wrap">
		<h2 id="creator-comment-heading" class="ttl">制作者のコメント</h2>

		<div class="inner">
			<div class="left">
				<div class="image">
					<?= $author_avatar_html; ?>
				</div>

				<div class="name">
					<?php if ( $profile_site_url ) : ?>
						<a href="<?= esc_url( $profile_site_url ); ?>" target="_blank" rel="noopener noreferrer">
							<?= esc_html( $author_name ); ?>
						</a>
					<?php else : ?>
						<?= esc_html( $author_name ); ?>
					<?php endif; ?>
				</div>

				<?php if ( $profile_site_url ) : ?>
					<div class="btn on_800px">
						<a href="<?= esc_url( $profile_site_url ); ?>" target="_blank" rel="noopener noreferrer">
							クリエイター情報はこちら
						</a>
					</div>
				<?php endif; ?>
			</div><!-- /.left -->

			<div class="right">
				<p><?= brSt( $page_comment ); ?></p>

				<?php if ( $profile_site_url ) : ?>
					<div class="btn none_800px">
						<a href="<?= esc_url( $profile_site_url ); ?>" target="_blank" rel="noopener noreferrer">
							クリエイター情報はこちら
						</a>
					</div>
				<?php endif; ?>
			</div><!-- /.right -->
		</div><!-- /.inner -->
	</div><!-- /.wrap -->
</div><!-- /.creator_comment_footer_bottom -->
