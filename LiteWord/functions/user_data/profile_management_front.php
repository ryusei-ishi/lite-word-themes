<?php
/**
 * LiteWord – Profile Manager (フロント)
 * ------------------------------------------------------------
 * フロント表示用ショートコード [lw_profile_info]
 * ------------------------------------------------------------
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/* =============================================================
 * 定数（管理画面と共通）
 * =========================================================== */
if ( ! defined( 'LW_PM_OPTION_KEY' ) ) {
	define( 'LW_PM_OPTION_KEY', 'lw_pm_profile_fields' );
}

/* =============================================================
 * 自分以外の user_id を出してよいか（2026-11-02 の点検 T8）
 * -------------------------------------------------------------
 * 寄稿者が下書きのプレビューに [lw_profile_info user_id="1"] を置くと、
 * 管理者などのプロフィールの項目を読めていたため。
 * 本文（the_content）の中では、そのショートコードを置いた投稿の書き手が
 * ユーザーを編集できる人（edit_users）かで決める。閲覧者の権限で決めないのは、
 * 管理者が作った「会員紹介」ページなどを、ふつうの閲覧者にも今までどおり見せるため。
 * 本文の外（ウィジェット・カスタマイザーのショートコード欄）は管理者しか置けないので今までどおり出す。
 * =========================================================== */
function lw_pm_can_show_other_user_profile() {
	if ( ! doing_filter( 'the_content' ) ) {
		return true;
	}
	$post = get_post();
	if ( ! $post ) {
		return true; // 投稿に紐づかない本文（カテゴリーの説明など）は管理画面の担当者が書くもの
	}
	return user_can( (int) $post->post_author, 'edit_users' );
}

/* =============================================================
 * フロント表示ショートコード
 * =========================================================== */
add_shortcode( 'lw_profile_info', function ( $atts ) {

	$atts = shortcode_atts( [ 'user_id' => get_current_user_id() ], $atts );
	$uid  = intval( $atts['user_id'] ); if ( ! $uid ) return '';

	// 自分以外のプロフィールは、置いた人に権限があるときだけ出す（2026-11-02 の点検 T8）
	if ( $uid !== get_current_user_id() && ! lw_pm_can_show_other_user_profile() ) {
		return '';
	}

	$fields = get_option( LW_PM_OPTION_KEY, [] ); if ( ! $fields ) return '';

	ob_start();
	echo '<div class="lw-pm-profile-info">';
	foreach ( $fields as $f ) {
		switch ( $f['type'] ) {

			case 'heading_h2':
			case 'heading_h3':
				$tag = $f['type'] === 'heading_h2' ? 'h2' : 'h3';
				echo '<' . $tag . ' class="lw-pm-heading">' . esc_html( $f['label'] ) . '</' . $tag . '>';
				if ( $f['note'] !== '' ) echo '<p class="lw-pm-note">' . nl2br( esc_html( $f['note'] ) ) . '</p>';
				break;

			case 'paragraph':
				echo '<p class="lw-pm-paragraph">' . nl2br( esc_html( $f['opt'] ?? '' ) ) . '</p>';
				if ( $f['note'] !== '' ) echo '<p class="lw-pm-note">' . nl2br( esc_html( $f['note'] ) ) . '</p>';
				break;

			default:
				$val = get_user_meta( $uid, $f['name'], true ); if ( $val === '' ) break;
				echo '<div class="lw-pm-field lw-pm-' . esc_attr( $f['name'] ) . '">';
				echo '<strong>' . esc_html( $f['label'] ) . '：</strong> ' . nl2br( esc_html( $val ) );
				if ( $f['note'] !== '' ) echo ' <span class="lw-pm-note">（' . nl2br( esc_html( $f['note'] ) ) . '）</span>';
				echo '</div>';
		}
	}
	echo '</div>';
	return ob_get_clean();
} );
?>