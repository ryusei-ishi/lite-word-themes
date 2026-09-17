<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― .htaccess の中身の書き換え（囲みの削除・置き場所・排他ロック）
 * =============================================================== */

/**
 * このテーマの囲みを全部外す
 *
 * @param string $content
 * @return string
 */
function lw_member_files_htaccess_strip( $content ) {
	$marker = preg_quote( lw_member_files_htaccess_marker(), '~' );
	return (string) preg_replace(
		'~^# BEGIN ' . $marker . '[ \t]*\R.*?^# END ' . $marker . '[^\r\n]*(?:\R(?:[ \t]*\R)?)?~ms',
		'',
		$content
	);
}

/**
 * 空の囲みを置く
 *
 * 「# BEGIN WordPress」の直前（insert_with_markers() は囲みが無いとファイルの最後に足すため）。
 * WordPress のルールが無いときは最後に置く（https への転送など、先にある他のルールより前に割り込まない）。
 *
 * @param string $content
 * @return string
 */
function lw_member_files_htaccess_place( $content ) {
	$marker = lw_member_files_htaccess_marker();
	$eol    = strpos( $content, "\r\n" ) !== false ? "\r\n" : "\n";
	$block  = '# BEGIN ' . $marker . $eol . '# END ' . $marker . $eol;

	if ( preg_match( '~^# BEGIN WordPress[ \t]*\r?$~m', $content, $hit, PREG_OFFSET_CAPTURE ) ) {
		return substr_replace( $content, $block . $eol, $hit[0][1], 0 );
	}
	if ( $content === '' ) {
		return $block;
	}
	return $content . ( substr( $content, -1 ) === "\n" ? '' : $eol ) . $eol . $block;
}

/**
 * .htaccess を排他ロックして読み書きする（書き込みが途中で失敗したら、元の中身に戻す）
 *
 * @param string   $path
 * @param callable $change 今の中身を受け取り、新しい中身を返す
 * @return bool
 */
function lw_member_files_htaccess_edit( $path, callable $change ) {
	$created = ! file_exists( $path );
	$handle  = @fopen( $path, 'c+' );
	if ( ! $handle ) {
		return false;
	}
	if ( $created ) {
		// 作ったばかりのファイルが Apache から読めないと、サイト全体が 403 になる（WordPress 本体と同じく最低 0644）
		$perms = fileperms( $path );
		if ( $perms ) {
			@chmod( $path, $perms | 0644 );
		}
	}
	flock( $handle, LOCK_EX );

	$original = (string) stream_get_contents( $handle );
	$updated  = (string) call_user_func( $change, $original );
	$ok       = true;

	if ( $updated !== $original ) {
		rewind( $handle );
		ftruncate( $handle, 0 );
		if ( fwrite( $handle, $updated ) !== strlen( $updated ) ) {
			rewind( $handle );
			ftruncate( $handle, 0 );
			fwrite( $handle, $original );
			$ok = false;
		}
		fflush( $handle );
	}

	flock( $handle, LOCK_UN );
	fclose( $handle );
	return $ok;
}
