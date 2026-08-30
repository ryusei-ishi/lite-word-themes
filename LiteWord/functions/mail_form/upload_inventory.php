<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセスを防止
}

/* ----------------------------------------------------------------
 * お問い合わせフォーム：添付ファイルの棚卸し（2026-08-23 新設・IdeaVoice #124 の #358）
 *
 * 何ファイル・何MB 置いてあるか、そのうち受信履歴から参照されているものが何件かを数える。
 *
 * 🚨 **自動で削除はしない。この機能は数えるだけ。**
 *    理由: 受信履歴の保存（lw_extensions_mail_form_reception_history_switch）は
 *    **既定 OFF**。切っているサイトでは添付の URL がどこにも記録されないため、
 *    「DB から参照されていない＝もう不要」とは絶対に言えない。
 *    添付の URL はサイト運営者に届いたメールの中に残っており、そこからしか辿れない。
 *    自動削除を入れると、受信履歴を切っているサイト（＝既定）では
 *    **届いた問い合わせの添付を全部消す**ことになる。
 *
 * 参照の判定は受信履歴の body に URL（またはファイル名）が含まれるかで行う。
 * body は LONGTEXT でファイル1件ずつ LIKE を打つと重いので、
 * 一度だけ読み込んでファイル名の集合を作って突き合わせる。
 *
 * 保存先 → upload_store.php
 *----------------------------------------------------------------*/

/**
 * 棚卸しの結果を返す（読むだけ・DBもファイルも書き換えない）。
 *
 * @param int $max 走査するファイル数の上限（大きなサイトで固まらないように）
 * @return array {
 *     @type bool   $dir_exists       専用ディレクトリがあるか
 *     @type string $dir              その場所
 *     @type bool   $protected        .htaccess が置かれているか
 *     @type int    $files            見つかったファイル数
 *     @type int    $bytes            合計バイト数
 *     @type string $oldest           いちばん古いファイルの日付
 *     @type string $newest           いちばん新しいファイルの日付
 *     @type bool   $history_on       受信履歴の保存が有効か
 *     @type int    $referenced       受信履歴から参照されている数（履歴OFFなら -1）
 *     @type int    $unreferenced     参照が見つからない数（履歴OFFなら -1）
 *     @type bool   $truncated        上限に達して途中で打ち切ったか
 * }
 */
function lw_mail_form_attachment_inventory( $max = 5000 ) {

	$dir = lw_mail_form_attachment_dir();

	$out = array(
		'dir_exists'   => is_dir( $dir['path'] ),
		'dir'          => $dir['path'],
		'protected'    => file_exists( $dir['path'] . '/.htaccess' ),
		'files'        => 0,
		'bytes'        => 0,
		'oldest'       => '',
		'newest'       => '',
		'history_on'   => false,
		'referenced'   => -1,
		'unreferenced' => -1,
		'truncated'    => false,
	);

	if ( ! $out['dir_exists'] ) {
		return $out;
	}

	/* ---- ファイルを数える ---- */
	$names   = array();
	$oldest  = 0;
	$newest  = 0;
	$skip    = array( '.', '..', '.htaccess', 'index.html', 'index.php' );

	$it = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $dir['path'], FilesystemIterator::SKIP_DOTS ),
		RecursiveIteratorIterator::LEAVES_ONLY
	);

	foreach ( $it as $file ) {
		if ( ! $file->isFile() ) {
			continue;
		}
		if ( in_array( $file->getFilename(), $skip, true ) ) {
			continue;
		}
		if ( $out['files'] >= $max ) {
			$out['truncated'] = true;
			break;
		}
		$out['files']++;
		$out['bytes'] += (int) $file->getSize();
		$names[] = $file->getFilename();

		$mt = (int) $file->getMTime();
		if ( ! $oldest || $mt < $oldest ) { $oldest = $mt; }
		if ( $mt > $newest ) { $newest = $mt; }
	}

	$out['oldest'] = $oldest ? date_i18n( 'Y-m-d', $oldest ) : '';
	$out['newest'] = $newest ? date_i18n( 'Y-m-d', $newest ) : '';

	/* ---- 受信履歴から参照されているか ---- */
	$switch = function_exists( 'Lw_theme_mod_set' )
		? Lw_theme_mod_set( 'lw_extensions_mail_form_reception_history_switch', 'off' )
		: 'off';
	$out['history_on'] = ( $switch === 'on' );

	if ( ! $out['history_on'] || ! $out['files'] ) {
		return $out; // 履歴が無ければ参照の有無は判定できない（-1 のまま返す）
	}

	global $wpdb;
	$table = $wpdb->prefix . 'lw_mail_reception_history';

	if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) ) !== $table ) {
		return $out;
	}

	/* body をまとめて読み、ファイル名が含まれるかを突き合わせる（1件ずつ LIKE を打たない） */
	$found  = array();
	$offset = 0;
	$chunk  = 200;

	while ( true ) {
		$rows = $wpdb->get_col( $wpdb->prepare( "SELECT body FROM {$table} ORDER BY id LIMIT %d OFFSET %d", $chunk, $offset ) );
		if ( ! $rows ) {
			break;
		}
		$haystack = implode( "\n", $rows );
		foreach ( $names as $n ) {
			if ( ! isset( $found[ $n ] ) && strpos( $haystack, $n ) !== false ) {
				$found[ $n ] = true;
			}
		}
		$offset += $chunk;
	}

	$out['referenced']   = count( $found );
	$out['unreferenced'] = max( 0, $out['files'] - $out['referenced'] );

	return $out;
}

/**
 * 棚卸しの結果を管理画面用のHTMLにする。
 *
 * @return string
 */
function lw_mail_form_attachment_inventory_html() {

	if ( ! current_user_can( 'manage_options' ) ) {
		return '';
	}

	$inv = lw_mail_form_attachment_inventory();

	if ( ! $inv['dir_exists'] ) {
		return '<div class="lw_mail_attach_inventory"><p>添付ファイルの保存先はまだ作られていません（添付付きの問い合わせを受け取ると作られます）。</p></div>';
	}

	$rows = array(
		'置き場所'   => esc_html( $inv['dir'] ),
		'保護'       => $inv['protected']
			? '.htaccess あり（Apache ではスクリプトの実行を禁止）'
			: '<strong style="color:#b32d2e;">.htaccess がありません</strong>',
		'ファイル数' => number_format_i18n( $inv['files'] ) . ' 件' . ( $inv['truncated'] ? '（上限まで数えた時点。実際はこれ以上）' : '' ),
		'合計サイズ' => size_format( $inv['bytes'] ),
		'いちばん古い' => $inv['oldest'] !== '' ? esc_html( $inv['oldest'] ) : '—',
		'いちばん新しい' => $inv['newest'] !== '' ? esc_html( $inv['newest'] ) : '—',
	);

	if ( $inv['history_on'] ) {
		$rows['受信履歴から参照されている'] = number_format_i18n( $inv['referenced'] ) . ' 件';
		$rows['参照が見つからない']         = number_format_i18n( $inv['unreferenced'] ) . ' 件';
	} else {
		$rows['受信履歴から参照されている'] = '判定できません（受信履歴の保存が無効のため）';
	}

	$html  = '<div class="lw_mail_attach_inventory" style="margin:24px 0;padding:16px 20px;background:#fff;border:1px solid #dcdcde;border-radius:6px;">';
	$html .= '<h3 style="margin:0 0 12px;font-size:15px;">添付ファイルの棚卸し</h3>';
	$html .= '<table class="widefat striped" style="max-width:820px;"><tbody>';
	foreach ( $rows as $k => $v ) {
		$html .= '<tr><th style="width:220px;">' . esc_html( $k ) . '</th><td>' . $v . '</td></tr>';
	}
	$html .= '</tbody></table>';
	$html .= '<p style="margin:12px 0 0;color:#646970;font-size:12px;">'
		. '※ここでは数えるだけで、ファイルの削除は行いません。添付のURLは受け取ったメールの中にも残っているため、'
		. '「受信履歴に見当たらない＝不要」とは限りません。整理する場合は上の置き場所を直接ご確認ください。</p>';
	$html .= '</div>';

	return $html;
}
