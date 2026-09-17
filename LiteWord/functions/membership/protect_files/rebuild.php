<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 目印と一覧を作り直す
 * =============================================================== */

/**
 * 目印と一覧を作り直す
 *
 * 写真をまとめてアップロードすると、同じ時間に何本も呼ばれる。
 * 1本ずつにするためデータベースのロックを取り、取れなかったら「あとでもう一度」の印だけ付けて帰る。
 * ロックを持っている側が、終わったあとに印を見て作り直す（待たせないため）。
 *
 * @return bool 作り直したか（他の作り直しに任せたとき・途中で失敗したときは false）
 */
function lw_member_files_rebuild() {
	global $wpdb;

	if ( lw_member_files_env()['error'] !== '' ) {
		return false;
	}

	$lock = 'lw_mf_' . substr( md5( ABSPATH . $wpdb->prefix ), 0, 20 );
	@set_time_limit( 120 );

	for ( $round = 0; $round < 5; $round++ ) {
		$got = $wpdb->get_var( $wpdb->prepare( 'SELECT GET_LOCK( %s, 0 )', $lock ) );
		if ( $got === '0' ) {
			lw_member_files_set_pending();
			return false;
		}

		$seen = lw_member_files_pending_value();
		try {
			$done = lw_member_files_rebuild_once();
		} finally {
			if ( $got !== null ) {
				$wpdb->query( $wpdb->prepare( 'SELECT RELEASE_LOCK( %s )', $lock ) );
			}
		}
		if ( ! $done ) {
			return false;
		}

		lw_member_files_clear_pending( $seen );   // 作り直している間に付いた新しい印は残す
		if ( $got === null || lw_member_files_pending_value() === null ) {
			return true;
		}
	}
	return true;
}

/**
 * 集めて、目印をそろえて、一覧を保存する
 *
 * @return bool
 */
function lw_member_files_rebuild_once() {
	// 作り直しの途中で落ちたら（時間切れ・メモリ不足）、この印が残るので管理画面で知らせる
	update_option( 'lw_member_files_building', time(), false );

	global $EZSQL_ERROR;
	$errors_before = is_array( $EZSQL_ERROR ) ? count( $EZSQL_ERROR ) : 0;   // エラーは表示を止めていてもここに記録される

	lw_member_files_db_failed( false );
	lw_member_files_attached_table( true );
	lw_member_files_refs_of_parts( [], 0, true );
	$collected = lw_member_files_collect();

	// 途中でデータベースのエラーが出たら、集めた結果が欠けている。目印を消して公開に戻さず、前のまま残す
	if ( lw_member_files_db_failed() || ( is_array( $EZSQL_ERROR ) ? count( $EZSQL_ERROR ) : 0 ) > $errors_before ) {
		delete_option( 'lw_member_files_building' );
		update_option( 'lw_member_files_db_error', time(), false );
		wp_schedule_single_event( time() + 5 * MINUTE_IN_SECONDS, 'lw_member_files_rebuild_event' );
		return false;
	}
	delete_option( 'lw_member_files_db_error' );

	$wanted = [];
	foreach ( $collected['protected'] as $item ) {
		foreach ( $item['files'] as $rel ) {
			$wanted[ $rel ] = $item['posts'];
		}
	}
	$failed = lw_member_files_sync_markers( $wanted );
	lw_member_files_save_index( $collected );

	if ( $failed ) {
		update_option( 'lw_member_files_failed', $failed, false );
	} else {
		delete_option( 'lw_member_files_failed' );
	}
	delete_option( 'lw_member_files_building' );
	return true;
}

/*
 * 「あとでもう一度」の印
 * 別のリクエストが書いた値を読むので、オプションのキャッシュを通さずデータベースを直接見る。
 * 作り直す側のリクエストが途中で止まっても、1分後の予約で拾う。
 */
function lw_member_files_set_pending() {
	update_option( 'lw_member_files_pending', uniqid( '', true ), false );
	wp_schedule_single_event( time() + MINUTE_IN_SECONDS, 'lw_member_files_rebuild_event' );
}

/** @return string|null */
function lw_member_files_pending_value() {
	global $wpdb;
	return $wpdb->get_var( "SELECT option_value FROM {$wpdb->options} WHERE option_name = 'lw_member_files_pending'" );
}

/** 読んだときと同じ印のときだけ消す */
function lw_member_files_clear_pending( $seen ) {
	global $wpdb;
	if ( $seen === null ) {
		return;
	}
	$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name = 'lw_member_files_pending' AND option_value = %s", $seen ) );
	wp_cache_delete( 'lw_member_files_pending', 'options' );
}

/**
 * 作り直しを頼む
 *
 * @param string $when 'now'＝このリクエストの最後に ／ 'later'＝裏の予約で ／ ''＝何もしない
 * @return void
 */
function lw_member_files_request_rebuild( $when = 'now' ) {
	static $queued = false;
	if ( $when === 'later' ) {
		if ( ! wp_next_scheduled( 'lw_member_files_rebuild_event' ) ) {
			wp_schedule_single_event( time(), 'lw_member_files_rebuild_event' );
		}
		return;
	}
	if ( $when !== 'now' || $queued ) {
		return;
	}
	$queued = true;
	add_action( 'shutdown', 'lw_member_files_rebuild_if_active', 1 );
}

function lw_member_files_rebuild_if_active() {
	if ( ! lw_member_files_is_active() ) {
		return;
	}
	ignore_user_abort( true );
	lw_member_files_rebuild();
}

add_action( 'lw_member_files_rebuild_event', 'lw_member_files_rebuild_if_active' );
