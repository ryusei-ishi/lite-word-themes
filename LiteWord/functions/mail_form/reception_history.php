<?php
/**
 * LiteWord – メール受信履歴保存
 * functions/mail_form/reception_history.php
 * ------------------------------------------------------------
 * 1) lw_ensure_mail_reception_history_table()
 *     └  テーブルが無い場合に dbDelta() で自動生成
 * 2) lw_save_mail_reception_history( $args )
 *     └  受信データ＋送信元ページ情報を保存
 *
 * ◆ テーブル構造（wp_lw_mail_reception_history）
 *      id            : BIGINT   主キー
 *      created_at    : DATETIME 受信日時
 *      subject       : TEXT     件名
 *      body          : LONGTEXT 入力データ(JSON)
 *      is_logged_in  : TINYINT  1=ログイン / 0=ゲスト
 *      user_id       : BIGINT   WPユーザーID
 *      form_set_no   : SMALLINT フォームセット番号
 *      post_id       : BIGINT   送信元投稿ID
 *      post_title    : TEXT     送信元タイトル
 *      post_author   : BIGINT   送信元投稿者ID
 *      sender_ip     : VARCHAR  送信元IP
 *      user_agent    : TEXT     UA
 * ------------------------------------------------------------ */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*--------------------------------------------------------------
  A. テーマ読込時に 1 回だけテーブル作成
--------------------------------------------------------------*/
add_action( 'after_setup_theme', 'lw_ensure_mail_reception_history_table' );

/*--------------------------------------------------------------
  B. 保存関数
--------------------------------------------------------------*/
if ( ! function_exists( 'lw_save_mail_reception_history' ) ) :
function lw_save_mail_reception_history( array $args ) {
	global $wpdb;
	lw_ensure_mail_reception_history_table();

	$table = $wpdb->prefix . 'lw_mail_reception_history';

	$wpdb->insert(
		$table,
		[
			'subject'       => sanitize_text_field( $args['subject']     ?? '' ),
			'body'          => wp_json_encode( $args['data'] ?? [], JSON_UNESCAPED_UNICODE ),
			'is_logged_in'  => is_user_logged_in() ? 1 : 0,
			'user_id'       => get_current_user_id(),
			'form_set_no'   => intval( $args['form_set_no']  ?? 0 ),
			'post_id'       => intval( $args['post_id']      ?? 0 ),
			'post_title'    => sanitize_text_field( $args['post_title']  ?? '' ),
			'post_author'   => intval( $args['post_author'] ?? 0 ),
			'sender_ip'     => sanitize_text_field( $_SERVER['REMOTE_ADDR']      ?? '' ),
			'user_agent'    => sanitize_textarea_field( $_SERVER['HTTP_USER_AGENT'] ?? '' ),
		],
		[ '%s','%s','%d','%d','%d','%d','%s','%d','%s','%s' ]
	);
}
endif;

/*--------------------------------------------------------------
  C. テーブル存在チェック＋dbDelta
--------------------------------------------------------------*/
if ( ! function_exists( 'lw_ensure_mail_reception_history_table' ) ) :
function lw_ensure_mail_reception_history_table() {
	global $wpdb;

	$table_name = $wpdb->prefix . 'lw_mail_reception_history';
	$charset    = $wpdb->get_charset_collate();

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';

	$sql = "
	CREATE TABLE {$table_name} (
		id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
		created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
		subject       TEXT           NOT NULL,
		body          LONGTEXT       NOT NULL,
		is_logged_in  TINYINT(1)     NOT NULL DEFAULT 0,
		user_id       BIGINT UNSIGNED NOT NULL DEFAULT 0,
		form_set_no   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
		post_id       BIGINT UNSIGNED NOT NULL DEFAULT 0,
		post_title    TEXT           NOT NULL,
		post_author   BIGINT UNSIGNED NOT NULL DEFAULT 0,
		sender_ip     VARCHAR(45)    NOT NULL DEFAULT '',
		user_agent    TEXT           NOT NULL,
		PRIMARY KEY (id),
		KEY created_at (created_at),
		KEY form_set_no (form_set_no),
		KEY post_id (post_id),
		KEY user_id (user_id)
	) {$charset};
	";
	dbDelta( $sql );

	if ( $wpdb->last_error ) {
		error_log( '[lw_mail] dbDelta error: ' . $wpdb->last_error );
	}
}
endif;
