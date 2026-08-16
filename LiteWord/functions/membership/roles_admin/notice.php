<?php
/**
 * 権限（ロール）の設定 — 画面上部のメッセージ
 *
 * 保存処理（handlers.php）は admin-post.php で走るので、そのままだと画面に何も出せない。
 * 結果を URL のクエリに載せて一覧へ戻し、ここで文言にして表示している。
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function lw_roles_admin_notice() {

	$msg = isset( $_GET['lw_msg'] ) ? sanitize_key( wp_unslash( $_GET['lw_msg'] ) ) : '';
	if ( ! $msg ) {
		return;
	}

	$detail = isset( $_GET['lw_detail'] ) ? sanitize_text_field( rawurldecode( wp_unslash( $_GET['lw_detail'] ) ) ) : '';

	switch ( $msg ) {
		case 'saved':
			$renamed = isset( $_GET['lw_count'] ) ? (int) $_GET['lw_count'] : 0;
			$leveled = isset( $_GET['lw_leveled'] ) ? (int) $_GET['lw_leveled'] : 0;
			$parts   = [];
			if ( $renamed ) {
				$parts[] = sprintf( '名前 %d 件', $renamed );
			}
			if ( $leveled ) {
				$parts[] = sprintf( 'できること %d 件', $leveled );
			}
			$text = $parts ? implode( '・', $parts ) . ' を変更しました。' : '変更はありませんでした。';
			$type = 'success';
			break;

		case 'reset':
			$text = '名前を元に戻しました。';
			$type = 'success';
			break;

		case 'created':
			$text = sprintf( '権限を追加しました（スラッグ: %s）。', $detail );
			$type = 'success';
			break;

		case 'deleted':
			$users = isset( $_GET['lw_users'] ) ? (int) $_GET['lw_users'] : 0;
			$meta  = isset( $_GET['lw_meta'] ) ? (int) $_GET['lw_meta'] : 0;
			$text  = sprintf( '権限を削除しました。ユーザー %d 人を移動し、会員限定の設定 %d 箇所を直しました。', $users, $meta );
			$type  = 'success';
			break;

		case 'error':
			$text = $detail ? $detail : '処理できませんでした。';
			$type = 'error';
			break;

		default:
			return;
	}

	printf(
		'<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
		esc_attr( $type ),
		esc_html( $text )
	);
}
