<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセスを防止
}

/* ----------------------------------------------------------------
 * お問い合わせフォーム：添付ファイルの保存先（2026-08-23 新設・IdeaVoice #124 の #358）
 *
 * 【なぜ専用ディレクトリにするか】
 *   添付は wp_handle_upload() で受けており、これまで WordPress 標準の
 *   uploads/YYYY/MM/ にそのまま置いていた。形式は upload_types.php が
 *   実データで判定しているので PHP ファイルが入ることは無いはずだが、
 *   「入らないはず」だけを守りにするのは薄い。多層防御として
 *   **添付だけを1つのディレクトリに集め、そこで実行を禁止する**。
 *   uploads/ 全体に .htaccess を置くやり方は採らない。他のプラグインが
 *   uploads 配下で PHP を動かしている場合に巻き添えで壊れるため。
 *
 * 🚨 すでに uploads/YYYY/MM/ にある既存の添付は動かさない。
 *    URL はメールで相手方に渡っており、移動すると過去の問い合わせのリンクが切れる。
 *    ここで変わるのは「これから受け取る添付の置き場」だけ。
 *
 * ⚠ .htaccess が効くのは Apache だけ。nginx のホストでは実行禁止は効かない
 *   （ファイルは書けるのでアップロード自体は成功する）。nginx でも守れているのは
 *   upload_types.php の実データ判定のほう。両方あって初めて多層防御になる。
 *
 * 棚卸し（何がどれだけ置いてあるか） → upload_inventory.php
 * 形式の判定 → upload_types.php ／ 流量制限 → upload_rate.php ／ 受理 → upload_guard.php
 *----------------------------------------------------------------*/

/**
 * uploads の下に作る添付用ディレクトリ名。
 *
 * @return string
 */
function lw_mail_form_attachment_subdir() {

	$sub = apply_filters( 'lw_mail_form_attachment_subdir', 'lw-mail-form' );

	/* フィルタが変な値を返しても uploads の外へ出ないようにする */
	$sub = trim( (string) $sub, "/\ \t\n\r\0\x0B" );
	if ( $sub === '' || strpos( $sub, '..' ) !== false ) {
		$sub = 'lw-mail-form';
	}

	return $sub;
}

/**
 * 添付ディレクトリの場所を返す（作成はしない）。
 *
 * @return array{path:string,url:string}
 */
function lw_mail_form_attachment_dir() {

	$uploads = wp_upload_dir( null, false );
	$sub     = lw_mail_form_attachment_subdir();

	return array(
		'path' => untrailingslashit( $uploads['basedir'] ) . '/' . $sub,
		'url'  => untrailingslashit( $uploads['baseurl'] ) . '/' . $sub,
	);
}

/**
 * ディレクトリに保護ファイル（.htaccess / index.html）を置く。
 *
 * .htaccess は Apache では下位ディレクトリにも効くので、年月フォルダごとに
 * 置く必要はない。中身が古い（FilesMatch が無い）場合だけ書き直す。
 *
 * @param string $dir
 * @return void
 */
function lw_mail_form_protect_dir( $dir ) {

	if ( $dir === '' || ! is_dir( $dir ) ) {
		return;
	}

	$htaccess = $dir . '/.htaccess';
	$rules    = "# LiteWord: 添付ファイルの置き場。スクリプトの実行を禁止する（自動生成）\n"
		. "Options -Indexes\n"
		. "<FilesMatch \"\.(php|phtml|phar|php[0-9]|pht|phps|cgi|pl|py|asp|aspx|sh|shtml|htaccess)$\">\n"
		. "  <IfModule mod_authz_core.c>\n    Require all denied\n  </IfModule>\n"
		. "  <IfModule !mod_authz_core.c>\n    Order Allow,Deny\n    Deny from all\n  </IfModule>\n"
		. "</FilesMatch>\n";

	if ( ! file_exists( $htaccess ) || strpos( (string) @file_get_contents( $htaccess ), 'FilesMatch' ) === false ) {
		@file_put_contents( $htaccess, $rules );
	}

	/* ディレクトリ一覧を止められないサーバー向けの目隠し */
	$index = $dir . '/index.html';
	if ( ! file_exists( $index ) ) {
		@file_put_contents( $index, '' );
	}
}

/**
 * 添付ディレクトリを用意して保護ファイルを置く。
 *
 * @return bool 用意できたか
 */
function lw_mail_form_prepare_attachment_dir() {

	$dir = lw_mail_form_attachment_dir();

	if ( ! is_dir( $dir['path'] ) && ! wp_mkdir_p( $dir['path'] ) ) {
		return false;
	}

	lw_mail_form_protect_dir( $dir['path'] );

	return true;
}

/**
 * wp_handle_upload() の保存先を添付ディレクトリに向けるフィルタ。
 *
 * 🚨 このフィルタは添付を保存する一瞬だけ掛けて必ず外すこと。
 *    掛けっぱなしにすると、同じリクエストで走る他のアップロード
 *    （メディアライブラリ・AI画像生成）まで巻き込む。
 *    掛ける／外すは lw_mail_form_handle_attachment_upload() に閉じてある。
 *
 * @param array $dirs
 * @return array
 */
function lw_mail_form_upload_dir_filter( $dirs ) {

	if ( empty( $dirs['basedir'] ) || empty( $dirs['baseurl'] ) ) {
		return $dirs; // 想定外の形なら触らない
	}

	$sub    = '/' . lw_mail_form_attachment_subdir();
	$subdir = isset( $dirs['subdir'] ) ? $dirs['subdir'] : ''; // 通常は /YYYY/MM

	$dirs['path']   = $dirs['basedir'] . $sub . $subdir;
	$dirs['url']    = $dirs['baseurl'] . $sub . $subdir;
	$dirs['subdir'] = $sub . $subdir;

	return $dirs;
}

/**
 * 添付1件を保存する（保存先を切り替えて wp_handle_upload を呼ぶ）。
 *
 * wp_handle_upload_prefilter を潰さないため wp_handle_upload 自体は使い続ける
 * （セキュリティプラグインが介入できる経路を残す）。
 *
 * @param array $info  $_FILES の1要素
 * @param array $mimes 許可MIME
 * @return array wp_handle_upload の戻り値
 */
function lw_mail_form_handle_attachment_upload( $info, $mimes ) {

	$ready = lw_mail_form_prepare_attachment_dir();

	if ( $ready ) {
		add_filter( 'upload_dir', 'lw_mail_form_upload_dir_filter' );
	}

	try {
		$upload = wp_handle_upload( $info, array( 'test_form' => false, 'mimes' => $mimes ) );
	} finally {
		if ( $ready ) {
			remove_filter( 'upload_dir', 'lw_mail_form_upload_dir_filter' );
		}
	}

	/* 年月フォルダが新しく作られた直後でも保護は親ディレクトリの .htaccess が担う */
	return $upload;
}
