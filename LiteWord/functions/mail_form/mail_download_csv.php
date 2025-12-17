<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * CSV ダウンロード処理
 */
add_action( 'admin_post_lw_mail_download_csv', 'lw_mail_download_csv_handler' );
function lw_mail_download_csv_handler() {
	
	// Nonce チェック
	if ( ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( $_GET['_wpnonce'], 'lw_mail_csv_download' ) ) {
		wp_die( 'Invalid nonce' );
	}

	// 権限チェック
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'Permission denied' );
	}

	$form_set_no  = isset( $_GET['form_set_no'] ) ? (int) $_GET['form_set_no'] : 0;
	$search_query = isset( $_GET['search'] ) ? trim( $_GET['search'] ) : '';

	if ( $form_set_no <= 0 ) {
		wp_die( 'Invalid form_set_no' );
	}

	global $wpdb;
	$table = $wpdb->prefix . 'lw_mail_reception_history';

	// 検索条件
	$where = $wpdb->prepare( "WHERE form_set_no = %d", $form_set_no );
	if ( $search_query !== '' ) {
		$like  = '%' . $wpdb->esc_like( $search_query ) . '%';
		$where .= $wpdb->prepare( " AND (body LIKE %s OR post_title LIKE %s)", $like, $like );
	}

	// 全件取得
	$rows = $wpdb->get_results(
		"SELECT id, created_at, post_id, post_title, body
		   FROM {$table}
		   {$where}
		   ORDER BY id DESC"
	);

	if ( ! $rows ) {
		wp_die( 'データが見つかりませんでした。' );
	}

	// データ整形
	$csv_data = [];
	$max_fields = 0;

	foreach ( $rows as $r ) {
		$created = mysql2date( 'Y-m-d H:i:s', $r->created_at );
		$post    = $r->post_id ? "{$r->post_id}：{$r->post_title}" : '-';

		$body_arr = json_decode( $r->body, true ) ?: [];
		unset( $body_arr['lw_current_post_id'] );

		$fields = [];
		foreach ( $body_arr as $label => $value ) {
			if ( is_array( $value ) ) {
				$value = implode( ', ', $value );
			}
			$fields[] = $value;
		}

		$max_fields = max( $max_fields, count( $fields ) );

		$csv_data[] = [
			'post'       => $post,
			'created_at' => $created,
			'fields'     => $fields
		];
	}

	// ヘッダー作成
	$header = [ 'post', 'created_at' ];
	for ( $i = 1; $i <= $max_fields; $i++ ) {
		$header[] = "field_{$i}";
	}

	// CSV 出力
	$timestamp = date( 'YmdHis' );
	$search_suffix = $search_query ? '_search' : '';
	$filename = "mail_history_{$form_set_no}{$search_suffix}_{$timestamp}.csv";

	header( 'Content-Type: text/csv; charset=UTF-8' );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	header( 'Pragma: no-cache' );
	header( 'Expires: 0' );

	// BOM 付加（Excelでの文字化け防止）
	echo "\xEF\xBB\xBF";

	// 出力バッファを開く
	$output = fopen( 'php://output', 'w' );

	// ヘッダー行を出力
	fputcsv( $output, $header );

	// データ行を出力
	foreach ( $csv_data as $row ) {
		$line = [ $row['post'], $row['created_at'] ];
		foreach ( $row['fields'] as $field ) {
			$line[] = $field;
		}
		// 足りないフィールドを空で埋める
		while ( count( $line ) < count( $header ) ) {
			$line[] = '';
		}
		fputcsv( $output, $line );
	}

	fclose( $output );
	exit;
}