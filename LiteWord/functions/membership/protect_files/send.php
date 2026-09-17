<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― ファイルを送る
 *
 * Cache-Control は private（サーバーの高速化機能や CDN に残さない）と
 * no-cache（ブラウザは毎回確かめる。変わっていなければ 304 で中身は送らない）。
 * 動画の早送りと iPhone での再生のため、範囲指定（Range）に応える。
 * =============================================================== */

/**
 * @param string $file 実体のパス
 * @param string $mime
 * @return void
 */
function lw_member_files_send( $file, $mime ) {
	$size  = (int) filesize( $file );
	$mtime = (int) filemtime( $file );
	$etag  = '"' . dechex( $size ) . '-' . dechex( $mtime ) . '"';

	@ini_set( 'zlib.output_compression', 'Off' );
	while ( ob_get_level() > 0 ) {
		@ob_end_clean();
	}

	header_remove( 'Pragma' );
	header( 'X-LW-Member-File: allowed' );
	header( 'Cache-Control: private, no-cache' );
	header( 'Expires: Wed, 11 Jan 1984 05:00:00 GMT' );   // サーバーの「ブラウザキャッシュ設定」（mod_expires）に期限を足させない
	header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s', $mtime ) . ' GMT' );
	header( 'ETag: ' . $etag );
	header( 'Accept-Ranges: bytes' );
	header( 'X-Content-Type-Options: nosniff' );
	header( 'X-Robots-Tag: noindex, nofollow' );

	if ( lw_member_files_not_modified( $etag, $mtime ) ) {
		status_header( 304 );
		exit;
	}

	$range = lw_member_files_parse_range( $size, $etag, $mtime );
	if ( $range === false ) {
		status_header( 416 );
		header( 'Content-Range: bytes */' . $size );
		exit;
	}

	$start  = $range ? $range[0] : 0;
	$length = $range ? $range[1] - $range[0] + 1 : $size;

	status_header( $range ? 206 : 200 );
	header( 'Content-Type: ' . $mime );
	if ( $mime === 'application/pdf' ) {
		header( "Content-Disposition: inline; filename*=UTF-8''" . rawurlencode( wp_basename( $file ) ) );
	}
	if ( $range ) {
		header( 'Content-Range: bytes ' . $range[0] . '-' . $range[1] . '/' . $size );
	}
	header( 'Content-Length: ' . $length );

	if ( ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'HEAD' ) || $length < 1 ) {
		exit;
	}

	@set_time_limit( 0 );
	$handle = fopen( $file, 'rb' );
	if ( $handle === false ) {
		exit;
	}
	fseek( $handle, $start );
	while ( $length > 0 && ! feof( $handle ) && ! connection_aborted() ) {
		$chunk = fread( $handle, min( 1048576, $length ) );
		if ( $chunk === false || $chunk === '' ) {
			break;
		}
		echo $chunk;
		flush();
		$length -= strlen( $chunk );
	}
	fclose( $handle );
	exit;
}

/**
 * ブラウザが持っているものと同じか（If-None-Match / If-Modified-Since）
 *
 * @param string $etag
 * @param int    $mtime
 * @return bool
 */
function lw_member_files_not_modified( $etag, $mtime ) {
	if ( ! empty( $_SERVER['HTTP_IF_NONE_MATCH'] ) ) {
		foreach ( explode( ',', (string) wp_unslash( $_SERVER['HTTP_IF_NONE_MATCH'] ) ) as $tag ) {
			$tag = trim( $tag );
			if ( $tag === '*' || preg_replace( '~^W/~', '', $tag ) === $etag ) {
				return true;
			}
		}
		return false;
	}
	if ( ! empty( $_SERVER['HTTP_IF_MODIFIED_SINCE'] ) ) {
		$since = strtotime( (string) wp_unslash( $_SERVER['HTTP_IF_MODIFIED_SINCE'] ) );
		return $since !== false && $since >= $mtime;
	}
	return false;
}

/**
 * 範囲指定を読む
 *
 * @param int    $size
 * @param string $etag
 * @param int    $mtime
 * @return array{0:int,1:int}|null|false 範囲 ／ null=全部送る ／ false=満たせない範囲（416）
 */
function lw_member_files_parse_range( $size, $etag, $mtime ) {
	$header = isset( $_SERVER['HTTP_RANGE'] ) ? trim( (string) wp_unslash( $_SERVER['HTTP_RANGE'] ) ) : '';
	if ( $header === '' || $size < 1 ) {
		return null;
	}

	$if_range = isset( $_SERVER['HTTP_IF_RANGE'] ) ? trim( (string) wp_unslash( $_SERVER['HTTP_IF_RANGE'] ) ) : '';
	if ( $if_range !== '' && $if_range !== $etag && strtotime( $if_range ) !== $mtime ) {
		return null;   // ファイルが変わっているので全部送り直す
	}

	// 複数の範囲・読めない形は、全部送る（範囲指定に応えなくても誤りではない）
	if ( ! preg_match( '~^bytes=(\d*)-(\d*)$~', $header, $hit ) || ( $hit[1] === '' && $hit[2] === '' ) ) {
		return null;
	}

	if ( $hit[1] === '' ) {
		$start = max( 0, $size - (int) $hit[2] );
		$end   = $size - 1;
		if ( (int) $hit[2] === 0 ) {
			return false;
		}
	} else {
		if ( $hit[2] !== '' && (int) $hit[1] > (int) $hit[2] ) {
			return null;   // 「500-400」のような読めない指定は、範囲指定が無いものとして全部送る
		}
		$start = (int) $hit[1];
		$end   = $hit[2] === '' ? $size - 1 : min( (int) $hit[2], $size - 1 );
	}

	return ( $start >= $size || $start > $end ) ? false : [ $start, $end ];
}
