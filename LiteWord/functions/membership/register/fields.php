<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：プロフィール項目
 *
 * 「ユーザー > プロフィール管理」で作った項目（option: lw_pm_profile_fields）を
 * 登録フォームにも出す。項目を2か所で作らせないためで、定義そのものは
 * functions/user_data/profile_management_admin.php が持っている。
 *
 * 種類は text / textarea / select / heading_h2 / heading_h3 / paragraph。
 * 入力欄になるのは前の3つで、残りは飾り（見出し・説明文）。
 *
 * 🚨 ここは「ログインしていない人が触れる保存処理」なので、
 *    管理画面側（lw_pm_save_fields）より条件を厳しくしている。
 * =============================================================== */

/** 1項目あたりに受け取る最大文字数（ボットの大量送信よけ） */
const LW_MEMBER_REGISTER_FIELD_MAX = 5000;

/**
 * 登録フォームに出す項目
 *
 * @return array
 */
function lw_member_register_profile_fields() {

	if ( ! lw_member_register_ask_profile() ) {
		return [];
	}

	$fields = get_option( 'lw_pm_profile_fields', [] );

	return is_array( $fields ) ? $fields : [];
}

/**
 * この項目名で user_meta を書いてよいか
 *
 * 🚨 これが無いと権限を乗っ取られる。
 *    たとえば項目名を wp_capabilities にすると、登録した人が自分の
 *    権限を書き換えられてしまう。管理者がうっかりその名前を付けた
 *    場合に備えて、保存側で必ず弾く。
 *
 * @param string $key
 * @return bool
 */
function lw_member_register_meta_is_safe( $key ) {

	global $wpdb;

	$key = (string) $key;

	if ( $key === '' || $key[0] === '_' ) {
		return false;   // 先頭がアンダースコアのものは WordPress の内部用
	}

	$deny = [
		'capabilities',
		'user_level',
		'user_roles',
		'wp_capabilities',
		'wp_user_level',
		'wp_user_roles',
		$wpdb->prefix . 'capabilities',
		$wpdb->prefix . 'user_level',
		$wpdb->prefix . 'user_roles',
		'session_tokens',
		'default_password_nag',
		'use_ssl',
		'rich_editing',
		'syntax_highlighting',
		'comment_shortcuts',
		'show_admin_bar_front',
		'admin_color',
		'locale',
	];

	return ! in_array( strtolower( $key ), array_map( 'strtolower', $deny ), true );
}

/**
 * 入力欄になる項目か（見出し・説明文ではないか）
 *
 * @param array $field
 * @return bool
 */
function lw_member_register_field_is_input( $field ) {

	$type = (string) ( $field['type'] ?? '' );

	return ! in_array( $type, [ 'heading_h2', 'heading_h3', 'paragraph' ], true );
}

/**
 * 送られてきたプロフィール項目を取り出す
 *
 * 🚨 ユーザーを作るのは認証番号が合ってから。それまでこの値は
 *    transient（仮登録）に預けるので、書き込みと取り出しを分けてある。
 *    ここを通った時点で「保存してよいと確認済み」の値だけになる。
 *
 * @return array メタキー => 値
 */
function lw_member_register_collect_profile_fields() {

	$values = [];

	foreach ( lw_member_register_profile_fields() as $field ) {

		if ( ! lw_member_register_field_is_input( $field ) ) {
			continue;
		}

		$name = (string) ( $field['name'] ?? '' );

		if ( ! lw_member_register_meta_is_safe( $name ) || ! isset( $_POST[ $name ] ) ) {
			continue;
		}

		$value = sanitize_textarea_field( wp_unslash( $_POST[ $name ] ) );
		$value = mb_substr( $value, 0, LW_MEMBER_REGISTER_FIELD_MAX );

		if ( $value === '' ) {
			continue;
		}

		/* select は用意した選択肢以外を受け取らない
		 * （画面の <option> を書き換えて送られても素通りさせない） */
		if ( ( $field['type'] ?? '' ) === 'select'
			&& ! in_array( $value, lw_member_register_field_options( $field ), true ) ) {
			continue;
		}

		$values[ $name ] = $value;
	}

	return $values;
}

/**
 * プロフィール項目をユーザーに書き込む
 *
 * 🚨 仮登録から取り出した値でも、書く直前にもう一度キーを確かめる。
 *    transient に何かの拍子で妙な値が入っていても、権限に関わる
 *    メタキーだけは絶対に書かせない。
 *
 * @param int   $user_id
 * @param array $values メタキー => 値
 * @return void
 */
function lw_member_register_apply_profile_fields( $user_id, $values ) {

	foreach ( (array) $values as $name => $value ) {

		if ( ! lw_member_register_meta_is_safe( (string) $name ) ) {
			continue;
		}

		update_user_meta( $user_id, (string) $name, (string) $value );
	}
}

/**
 * select の選択肢
 *
 * 管理画面では改行区切りの1つのテキストとして持っている。
 *
 * @param array $field
 * @return string[]
 */
function lw_member_register_field_options( $field ) {

	$raw = (string) ( $field['opt'] ?? '' );

	return array_values( array_filter( array_map( 'trim', explode( "\n", $raw ) ) ) );
}

/**
 * 入力し直しのときに前回の値を戻す
 *
 * @param array $field
 * @return string
 */
function lw_member_register_field_value( $field ) {

	$name = (string) ( $field['name'] ?? '' );

	if ( $name === '' || ! isset( $_POST[ $name ] ) ) {
		return '';
	}

	return sanitize_textarea_field( wp_unslash( $_POST[ $name ] ) );
}
