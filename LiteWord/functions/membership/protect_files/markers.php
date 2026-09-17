<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 目印ファイルと一覧
 *
 * uploads/lw-member-files/ の下に、守るファイルと同じパスで小さな目印を置く。
 * .htaccess のルールは「目印があるファイルだけ WordPress を通す」。
 * 目印の中身は、そのファイルを使っている会員限定の記事の ID（{"posts":[12,45]}）。
 * =============================================================== */

/** 目印を置くフォルダ */
function lw_member_files_marker_root() {
	return lw_member_files_env()['basedir'] . '/' . lw_member_files_marker_dirname();
}

/**
 * 目印のフォルダを用意する（直接開かせないための .htaccess と、空の index.php も置く）
 *
 * @return bool
 */
function lw_member_files_prepare_marker_root() {
	$root = lw_member_files_marker_root();
	if ( ! is_dir( $root ) && ! wp_mkdir_p( $root ) ) {
		return false;
	}

	$deny = "# LiteWord: 会員限定のファイルの目印（自動生成）\n"
		. "<IfModule mod_authz_core.c>\n\tRequire all denied\n</IfModule>\n"
		. "<IfModule !mod_authz_core.c>\n\tOrder Allow,Deny\n\tDeny from all\n</IfModule>\n";
	if ( ! is_file( $root . '/.htaccess' ) || file_get_contents( $root . '/.htaccess' ) !== $deny ) {
		@file_put_contents( $root . '/.htaccess', $deny );
	}
	if ( ! is_file( $root . '/index.php' ) ) {
		@file_put_contents( $root . '/index.php', "<?php\n// Silence is golden.\n" );
	}

	return is_writable( $root );
}

/**
 * 目印をそろえる（足りないものを作り、中身を直し、要らないものを消す）
 *
 * @param array<string,int[]> $wanted パス => 記事ID
 * @return int 書けなかった数
 */
function lw_member_files_sync_markers( array $wanted ) {
	if ( ! lw_member_files_prepare_marker_root() ) {
		return max( 1, count( $wanted ) );
	}

	$root   = lw_member_files_marker_root();
	$failed = 0;
	foreach ( $wanted as $rel => $posts ) {
		$path = $root . '/' . $rel;
		$body = wp_json_encode( [ 'posts' => array_values( array_map( 'intval', $posts ) ) ] );
		if ( is_file( $path ) && file_get_contents( $path ) === $body ) {
			continue;
		}
		if ( ( ! is_dir( dirname( $path ) ) && ! wp_mkdir_p( dirname( $path ) ) ) || file_put_contents( $path, $body, LOCK_EX ) === false ) {
			$failed++;
		}
	}

	lw_member_files_remove_stale_markers( $root, $wanted );
	return $failed;
}

/**
 * 要らなくなった目印と、空になったフォルダを消す（点検中の目印は残す）
 *
 * @param string              $root
 * @param array<string,int[]> $wanted
 * @return void
 */
function lw_member_files_remove_stale_markers( $root, array $wanted ) {
	$check = lw_member_files_check_dirname() . '/';

	// 読めないフォルダがあっても止まらない（残った目印は次の作り直しで消す）
	try {
		$items = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS ),
			RecursiveIteratorIterator::CHILD_FIRST
		);
		foreach ( $items as $item ) {
			if ( $item->isDir() ) {
				@rmdir( $item->getPathname() );   // 空のときだけ消える
				continue;
			}
			$rel = substr( wp_normalize_path( $item->getPathname() ), strlen( $root ) + 1 );
			if ( $rel === '.htaccess' || $rel === 'index.php' || strpos( $rel, $check ) === 0 || isset( $wanted[ $rel ] ) ) {
				continue;
			}
			@unlink( $item->getPathname() );
		}
	} catch ( Exception $e ) {
		return;
	}
}

/**
 * 目印のフォルダと点検用のフォルダを丸ごと消す（OFF にしたとき）
 *
 * @return void
 */
function lw_member_files_delete_all_markers() {
	$basedir = lw_member_files_env()['basedir'];
	if ( $basedir === '' || ! is_dir( $basedir ) ) {
		return;
	}
	foreach ( [ lw_member_files_marker_dirname(), lw_member_files_check_dirname() ] as $name ) {
		$dir = $basedir . '/' . $name;
		if ( ! is_dir( $dir ) || is_link( $dir ) ) {
			continue;
		}
		try {
			$items = new RecursiveIteratorIterator(
				new RecursiveDirectoryIterator( $dir, FilesystemIterator::SKIP_DOTS ),
				RecursiveIteratorIterator::CHILD_FIRST
			);
			foreach ( $items as $item ) {
				$item->isDir() && ! $item->isLink() ? @rmdir( $item->getPathname() ) : @unlink( $item->getPathname() );
			}
		} catch ( Exception $e ) {
			continue;
		}
		@rmdir( $dir );
	}
}

/**
 * 保存してある一覧
 *
 * @return array
 */
function lw_member_files_get_index() {
	$index = get_option( 'lw_member_files_index', [] );
	return is_array( $index ) ? $index : [];
}

/**
 * 一覧を保存する（フックから素早く引けるよう、ファイル・メディア・記事の表も作る）
 *
 * @param array $collected lw_member_files_collect() の戻り値
 * @return void
 */
function lw_member_files_save_index( array $collected ) {
	$files       = [];
	$attachments = [];
	$posts       = [];

	foreach ( [ 'protected', 'skipped' ] as $group ) {
		foreach ( $collected[ $group ] as $key => $item ) {
			foreach ( $item['files'] as $rel ) {
				$files[ $rel ] = $key;
			}
			$same_file = isset( $item['siblings'] ) ? $item['siblings'] : ( $item['attachment'] ? [ $item['attachment'] ] : [] );
			foreach ( $same_file as $attachment_id ) {
				$attachments[ $attachment_id ] = $key;
			}
			foreach ( $item['posts'] as $id ) {
				$posts[ $id ] = true;
			}
			foreach ( isset( $item['public'] ) ? $item['public'] : [] as $label ) {
				if ( preg_match( '~^(?:post|menu|thumbnail|ogp):(\d+)$~', $label, $hit ) ) {
					$posts[ (int) $hit[1] ] = true;
				}
			}
		}
	}

	update_option( 'lw_member_files_index', [
		'built_at'    => time(),
		'protected'   => $collected['protected'],
		'skipped'     => $collected['skipped'],
		'files'       => $files,
		'attachments' => $attachments,
		'posts'       => $posts,
	], false );
}
