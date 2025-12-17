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
 * フロント表示ショートコード
 * =========================================================== */
add_shortcode( 'lw_profile_info', function ( $atts ) {

	$atts = shortcode_atts( [ 'user_id' => get_current_user_id() ], $atts );
	$uid  = intval( $atts['user_id'] ); if ( ! $uid ) return '';

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