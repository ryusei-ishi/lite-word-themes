<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
$lw_comment_functions = Lw_theme_mod_set("lw_extensions_comment_functions_switch", "off");
$lw_comment_functions = Lw_put_text( 'comment_page_switch',$lw_comment_functions );
if($lw_comment_functions === "off"){
	return; // コメント機能が無効な場合は何も出力しない
}
/* -------------------------------------------------
 * 管理画面 / 非シングル / パスワード保護
 * ------------------------------------------------ */
if ( is_admin() || ! is_singular() || post_password_required() ) { return; }

/* -------------------------------------------------
 * スタイル & スレッド JS
 * ------------------------------------------------ */
wp_enqueue_style(
	'lw_comment_style',
	get_template_directory_uri() . '/templates/comment/style.min.css',
	[],
	css_version(),
	'all'
);
if ( comments_open() && get_option( 'thread_comments' ) ) {
	wp_enqueue_script( 'comment-reply' );
}

/* =================================================
 * callback – 階層コメントをカスタム HTML で出力
 * ================================================= */
if ( ! function_exists( 'lw_comment_callback' ) ) :
function lw_comment_callback( $comment, $args, $depth ) { ?>
	<li <?php comment_class( 'lw_comment_body' ); ?> id="comment-<?php comment_ID(); ?>">
		<div class="lw_comment_avatar_wrap">
			<?php echo get_avatar( $comment, 48, '', '', [ 'class' => 'lw_comment_avatar' ] ); ?>
            <p class="lw_comment_body_meta">
                <span class="lw_comment_author"><?php echo esc_html( get_comment_author( $comment ) ); ?></span>
                <span class="lw_comment_date"><?php echo esc_html( get_comment_date( '', $comment ) ); ?></span>
            </p>
		</div>

		<div class="lw_comment_body_content">

			<div class="lw_comment_text"><?php comment_text(); ?></div>

			<?php
				comment_reply_link( array_merge( $args, [
					'depth'      => $depth,
					'max_depth'  => $args['max_depth'],
					'reply_text' => '返信する',
				] ) );
			?>
		</div>
<?php /* </li> は Walker が自動で閉じます */ }
endif;

/* -------------------------------------------------
 * 投稿に紐づく承認済みコメントを取得（ASC 時系列）
 * ------------------------------------------------ */
$lw_comments = get_comments( [
	'post_id' => get_the_ID(),
	'status'  => 'approve',
	'orderby' => 'comment_date_gmt',
	'order'   => 'ASC',
] );
?>

<div class="lw_comments_area_wrap">
	<div id="lw_comments" class="lw_comments_area">

		<?php if ( $lw_comments ) : ?>
			<div class="lw_comment_bodies">
				<h2 class="lw_comment_bodies_title">
                    <span>これまでのコメント</span>    
                    <span class="total_comment"><?php printf( '全%d件', count( $lw_comments ) ); ?></span>
                </h2>

				<ul class="lw_comment_bodies_list">
					<?php
					wp_list_comments(
						[
							'style'            => 'ul',
							'type'             => 'comment',
							'avatar_size'      => 48,
							'callback'         => 'lw_comment_callback',
							'reply_text'       => '返信する',
							'max_depth'        => get_option( 'thread_comments_depth' ),
							'reverse_top_level'=> true,
							'reverse_children' => false,
						],
						$lw_comments        // ← 取得済み配列を直接渡す
					);
					?>
				</ul>
			</div>
		<?php endif; ?>

		<?php
		/* ▼コメントフォーム */
		comment_form( [
			'title_reply_before' => '<h2 id="lw_reply-title" class="lw_comment_reply_title">',
			'title_reply_after'  => '</h2>',
			'title_reply'        => 'コメントを残す',
			'label_submit'       => '送信する',
			'class_submit'       => 'lw_comment_submit_button',
		] );
		?>

	</div><!-- /.lw_comments_area -->
</div><!-- /.lw_comments_area_wrap -->
