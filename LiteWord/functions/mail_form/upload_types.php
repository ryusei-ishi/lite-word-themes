<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセスを防止
}

/* ----------------------------------------------------------------
 * お問い合わせフォーム：添付ファイルの形式判定
 *
 * 受け付けるのは「画像」と「PDF」だけ。ZIP・動画・音声・Office 文書は含めない
 * （匿名の訪問者にサイトのドメインで任意ファイルを配布させないため）。
 * マニュアルの「写真や書類の添付」に合わせて PDF は許可している。
 *
 * 🔒 クライアントが送ってくる MIME ヘッダ（$_FILES[..]['type']）とファイル名の拡張子は
 *    偽装できるので一切信用しない。必ず実データから判定する。
 *----------------------------------------------------------------*/

/**
 * getimagesize() の IMAGETYPE_* → 拡張子の対応表。
 *
 * 🚨 IMAGETYPE_WEBP は PHP 7.1+、IMAGETYPE_AVIF は PHP 8.1+ で追加された定数。
 *    テーマの Requires PHP は 7.4 なので、未定義の定数を配列キーに直書きすると
 *    PHP 8.0 では Fatal（7.4 では Warning＋キーが文字列化）になる。php -l では
 *    検出できないため、必ず defined() で囲んで動的に組む。
 *
 * @return array
 */
function lw_mail_form_image_types() {

	$types = array(
		IMAGETYPE_JPEG    => 'jpg',
		IMAGETYPE_PNG     => 'png',
		IMAGETYPE_GIF     => 'gif',
		IMAGETYPE_BMP     => 'bmp',
		IMAGETYPE_TIFF_II => 'tif',
		IMAGETYPE_TIFF_MM => 'tif',
	);
	if ( defined( 'IMAGETYPE_WEBP' ) ) {
		$types[ IMAGETYPE_WEBP ] = 'webp';
	}
	if ( defined( 'IMAGETYPE_AVIF' ) ) {
		$types[ IMAGETYPE_AVIF ] = 'avif';
	}

	return $types;
}

/**
 * getimagesize() では読めない形式の許可リスト（MIME → 拡張子）。
 *
 * ・HEIC/HEIF … iPhone の写真。PHP に読み取りサポートが無く getimagesize() は false を返す
 * ・AVIF      … PHP 8.1 未満では getimagesize() が false を返す
 * ・PDF       … マニュアルが「写真や書類の添付」と明記しているため許可する
 *
 * 運用で他の形式が必要になったらこのフィルタで足す。
 *
 * @return array
 */
function lw_mail_form_fallback_upload_types() {

	$types = array(
		'image/heic'      => 'heic',
		'image/heif'      => 'heif',
		'image/avif'      => 'avif',
		'application/pdf' => 'pdf',
	);
	$filtered = apply_filters( 'lw_mail_form_fallback_upload_types', $types );

	return is_array( $filtered ) ? $filtered : $types;
}

/**
 * wp_handle_upload() に渡す許可MIME一覧（WordPress 形式）。
 *
 * 🔒 基準は get_allowed_mime_types()。wp_get_mime_types() ではなく upload_mimes 適用済みの
 *    方を使うのは、サイトが独自に許可を「絞っている／足している」方針をそのまま尊重するため
 *    （セキュリティプラグインで jpg/png だけに絞っているサイトの方針を上書きしない）。
 *
 * @return array
 */
function lw_mail_form_upload_mimes() {

	$allowed = array_merge(
		array_values( lw_mail_form_image_types() ),
		array_values( lw_mail_form_fallback_upload_types() )
	);
	$allowed = array_map( 'strval', $allowed );

	$base = function_exists( 'get_allowed_mime_types' ) ? get_allowed_mime_types() : wp_get_mime_types();
	if ( ! is_array( $base ) ) {
		$base = wp_get_mime_types();
	}

	$mimes = array();
	foreach ( $base as $pattern => $mime ) {
		foreach ( explode( '|', (string) $pattern ) as $ext ) {
			if ( in_array( $ext, $allowed, true ) ) {
				$mimes[ $pattern ] = $mime;
				break;
			}
		}
	}

	return $mimes;
}

/**
 * 1ファイルあたりのサイズ上限（バイト）。
 *
 * サーバの upload_max_filesize / post_max_size より大きい値を案内しても嘘になるので、
 * wp_max_upload_size() と突き合わせて小さい方を採る。
 *
 * @return int
 */
function lw_mail_form_upload_max_size() {

	$limit = (int) apply_filters( 'lw_mail_form_upload_max_size', 10 * 1024 * 1024 );
	if ( $limit <= 0 ) {
		$limit = 10 * 1024 * 1024;
	}
	if ( function_exists( 'wp_max_upload_size' ) ) {
		$server = (int) wp_max_upload_size();
		if ( $server > 0 && $server < $limit ) {
			$limit = $server;
		}
	}

	return $limit;
}

/**
 * getimagesize() で読めない形式を、先頭バイトから自前で判定する。
 *
 * 🔒 fileinfo 拡張が無いホストや HEIC を知らない古い WordPress では、
 *    WP の判定が「ファイル名の拡張子」頼みになり、中身が任意のバイト列でも
 *    x.heic / x.pdf として通ってしまう。環境差に依存しないよう自分で確認する。
 *
 * @param string $path
 * @return string 判定できた MIME。判定できなければ ''
 */
function lw_mail_form_sniff_binary( $path ) {

	$head = @file_get_contents( $path, false, null, 0, 16 );
	if ( ! is_string( $head ) || strlen( $head ) < 12 ) {
		return '';
	}

	if ( strncmp( $head, '%PDF-', 5 ) === 0 ) {
		return 'application/pdf';
	}

	/* ISO Base Media 形式（HEIC/HEIF/AVIF）は 5〜8 バイト目が 'ftyp' で、続く4バイトがブランド */
	if ( substr( $head, 4, 4 ) === 'ftyp' ) {
		$brands = array(
			'heic' => 'image/heic',
			'heix' => 'image/heic',
			'heim' => 'image/heic',
			'heis' => 'image/heic',
			'hevc' => 'image/heic',
			'hevx' => 'image/heic',
			'hevm' => 'image/heic',
			'hevs' => 'image/heic',
			'mif1' => 'image/heif',
			'msf1' => 'image/heif',
			'avif' => 'image/avif',
			'avis' => 'image/avif',
		);
		$brand = substr( $head, 8, 4 );
		if ( isset( $brands[ $brand ] ) ) {
			return $brands[ $brand ];
		}
	}

	return '';
}

/**
 * 実データから拡張子を確定する。
 *
 * @param array $info $_FILES の1要素（形状チェック済み）
 * @return string 許可された拡張子。判定できなければ ''
 */
function lw_mail_form_detect_upload_extension( $info ) {

	/* ① 本物の画像か（実ピクセルを読めるかどうか）。SVG・PHP・ZIP はここで落ちる */
	if ( function_exists( 'getimagesize' ) ) {
		$image_info = @getimagesize( $info['tmp_name'] );
		if ( is_array( $image_info ) && ! empty( $image_info[2] ) ) {
			$types = lw_mail_form_image_types();
			return isset( $types[ $image_info[2] ] ) ? $types[ $image_info[2] ] : '';
		}
	}

	/* ② getimagesize() が読めない形式（HEIC/HEIF/AVIF）と PDF は自前のマジックバイト判定 */
	$sniffed = lw_mail_form_sniff_binary( $info['tmp_name'] );
	if ( $sniffed === '' ) {
		return '';
	}
	$fallback = lw_mail_form_fallback_upload_types();
	if ( ! isset( $fallback[ $sniffed ] ) ) {
		return '';
	}
	/* サイトの許可MIMEにも入っているか（upload_mimes での絞り込みを尊重する） */
	if ( ! in_array( $sniffed, lw_mail_form_upload_mimes(), true ) ) {
		return '';
	}

	return $fallback[ $sniffed ];
}

/**
 * 保存するファイル名を組み立てる。
 *
 * ・拡張子は実データ由来のものに差し替える（evil.php.jpg のような二重拡張子はドットを潰す）
 * ・元のベース名は残す（管理者がメール・受信履歴で中身を判別する手掛かりになる）
 * ・ランダムな接尾辞を足して URL を推測できないようにする
 *   （uploads は未認証で閲覧できるため、IMG_0001.jpg や 履歴書.pdf は列挙されてしまう）
 *
 * @param string $name 送信されたファイル名
 * @param string $ext  実データから確定した拡張子
 * @return string
 */
function lw_mail_form_safe_upload_filename( $name, $ext ) {

	$base = (string) pathinfo( $name, PATHINFO_FILENAME );
	$base = str_replace( '.', '_', $base );
	$base = sanitize_file_name( $base );

	if ( $base === '' ) {
		$base = 'lw_form_file';
	}
	$base = function_exists( 'mb_substr' ) ? mb_substr( $base, 0, 60 ) : substr( $base, 0, 60 );

	$suffix = function_exists( 'wp_generate_password' ) ? wp_generate_password( 10, false, false ) : (string) mt_rand( 100000, 999999 );

	return $base . '-' . $suffix . '.' . $ext;
}
