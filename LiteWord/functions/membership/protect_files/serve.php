<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― ファイルを渡す窓口
 *
 * .htaccess が「目印のあるファイル」だけを index.php?lw_member_file=1 に回してくる。
 * URL はそのまま（REQUEST_URI）なので、そこからファイルを決め、見る権限があれば渡す。
 * 本文の表示（テンプレート）より前の init で終わらせる。
 * =============================================================== */

add_action( 'init', 'lw_member_files_serve', 0 );

function lw_member_files_serve() {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}
	if ( ! defined( 'DONOTCACHEPAGE' ) ) {
		define( 'DONOTCACHEPAGE', true );   // キャッシュ系プラグインに保存させない
	}

	$rel  = lw_member_files_request_rel();
	$file = $rel !== '' ? lw_member_files_env()['basedir'] . '/' . $rel : '';
	$type = $file !== '' ? wp_check_filetype( $file ) : [ 'type' => false ];

	if ( $rel === '' || empty( $type['type'] ) || ! is_file( lw_member_files_marker_path( $rel ) ) || ! lw_member_files_is_inside_uploads( $file ) ) {
		lw_member_files_refuse( 404 );
	}

	if ( lw_member_files_enabled() && ! lw_member_files_can_access( lw_member_files_marker_posts( $rel ) ) ) {
		if ( ! is_user_logged_in() && lw_member_files_is_page_request() ) {
			// ブラウザで直接開いた人は、ログイン後にこのファイルへ戻す
			nocache_headers();
			header( 'X-LW-Member-File: denied' );
			wp_safe_redirect( wp_login_url( lw_member_files_url( $rel ) ) );
			exit;
		}
		lw_member_files_refuse( 403 );
	}

	lw_member_files_send( $file, $type['type'] );
}

/**
 * 実体が uploads の中にあるか（リンクで外を指していないか）
 *
 * @param string $file
 * @return bool
 */
function lw_member_files_is_inside_uploads( $file ) {
	$real = realpath( $file );
	$base = realpath( lw_member_files_env()['basedir'] );
	if ( ! $real || ! $base || ! is_file( $real ) ) {
		return false;
	}
	return strpos( wp_normalize_path( $real ), trailingslashit( wp_normalize_path( $base ) ) ) === 0;
}

/**
 * 目印に書いてある、そのファイルを使っている会員限定の記事の ID
 *
 * @param string $rel
 * @return int[]
 */
function lw_member_files_marker_posts( $rel ) {
	$data = json_decode( (string) @file_get_contents( lw_member_files_marker_path( $rel ) ), true );
	return ( is_array( $data ) && isset( $data['posts'] ) && is_array( $data['posts'] ) ) ? array_map( 'intval', $data['posts'] ) : [];
}

/**
 * いまの人に渡してよいか
 *
 *   ・メディアを扱える人（管理者・編集者・投稿者）… メディアライブラリ・編集画面・下書きのプレビューは今までどおり
 *   ・そのファイルを使っている公開中の記事の、どれか1つを見られる人
 *
 * 「その記事を編集できる人」は通さない（寄稿者が自分の下書きに参照を書き足して、何でも見られるようにできるため）。
 *
 * @param int[] $post_ids
 * @return bool
 */
function lw_member_files_can_access( array $post_ids ) {
	if ( current_user_can( 'upload_files' ) ) {
		return true;
	}
	foreach ( $post_ids as $post_id ) {
		$post = get_post( $post_id );
		if ( ! $post ) {
			continue;
		}
		$readable = $post->post_status === 'publish'
			|| ( $post->post_status === 'private' && current_user_can( 'read_post', $post->ID ) );
		if ( $readable && lw_membership_can_view_post( $post ) ) {
			return true;
		}
	}
	return false;
}

/**
 * ブラウザでファイルを直接開いたリクエストか（画像として読み込まれた場合は違う）
 *
 * @return bool
 */
function lw_member_files_is_page_request() {
	if ( isset( $_SERVER['HTTP_SEC_FETCH_DEST'] ) ) {
		return strtolower( (string) wp_unslash( $_SERVER['HTTP_SEC_FETCH_DEST'] ) ) === 'document';
	}
	return isset( $_SERVER['HTTP_ACCEPT'] ) && strpos( (string) wp_unslash( $_SERVER['HTTP_ACCEPT'] ), 'text/html' ) !== false;
}

/**
 * 渡さない（403 / 404）
 *
 * @param int $status
 * @return void
 */
function lw_member_files_refuse( $status ) {
	nocache_headers();
	status_header( $status );
	header( 'X-LW-Member-File: ' . ( $status === 403 ? 'denied' : 'not-found' ) );
	header( 'X-Robots-Tag: noindex, nofollow' );
	header( 'Content-Type: text/plain; charset=UTF-8' );
	echo $status === 403 ? 'このファイルを見る権限がありません。' : 'ファイルが見つかりません。';
	exit;
}
