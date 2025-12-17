<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * ショップURL自動設定
 * 環境に応じて常に正しいURLを設定
 */

add_action( 'admin_init', 'lw_setup_local_shop_url', 1 );

function lw_setup_local_shop_url() {
	// 環境に応じてショップURLを決定
	$is_local = ( strpos( home_url(), 'localhost' ) !== false || strpos( home_url(), '127.0.0.1' ) !== false );

	if ( $is_local ) {
		// ローカル環境
		$shop_url = 'http://localhost/SUPPORT_LOUNGE/LiteWord_SHOP';
	} else {
		// 本番・テスト環境
		$shop_url = 'https://shop.lite-word.com';
	}

	// 現在の設定と異なる場合のみ更新
	$existing_url = get_option( 'lw_shop_url' );
	if ( $existing_url !== $shop_url ) {
		update_option( 'lw_shop_url', $shop_url );
	}
}
