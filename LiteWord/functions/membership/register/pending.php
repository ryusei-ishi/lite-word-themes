<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord ― 会員登録：仮登録（メールの認証番号）
 *
 * 🚨 ここが「迷惑登録でユーザー一覧が埋まらない」ための要。
 *    フォームを送信した時点では wp_users に1行も作らない。
 *    入力内容は transient に預けておき、メールに送った6桁の番号が
 *    合って初めてユーザーを作る。
 *
 * 預ける先を transient にしているのは、掃除が要らないから。
 * 30分で勝手に消えるので、番号を入れなかった人のゴミが残らない。
 * =============================================================== */

/** 仮登録の有効期限 */
const LW_MEMBER_REGISTER_PENDING_TTL = 1800;   // 30分

/** 番号を間違えられる回数 */
const LW_MEMBER_REGISTER_MAX_TRIES = 5;

/**
 * 合言葉（トークン）の形を整える
 *
 * URL に載るので、英数字32文字ちょうど以外は受け付けない。
 *
 * @param mixed $token
 * @return string 不正なら空文字
 */
function lw_member_register_sanitize_token( $token ) {

	$token = preg_replace( '/[^A-Za-z0-9]/', '', (string) $token );

	return strlen( $token ) === 32 ? $token : '';
}

/**
 * transient のキー
 *
 * @param string $token 整形済みのトークン
 * @return string
 */
function lw_member_register_pending_key( $token ) {
	return 'lw_reg_pending_' . $token;
}

/**
 * 6桁の認証番号を作る
 *
 * 🚨 rand() ではなく wp_rand()。暗号として安全な乱数を使う。
 *    予測できると、番号を知らない人でも登録を完了できてしまう。
 *
 * @return string
 */
function lw_member_register_make_code() {
	return str_pad( (string) wp_rand( 0, 999999 ), 6, '0', STR_PAD_LEFT );
}

/**
 * 認証番号をそのまま保存しない（照合用のハッシュにする）
 *
 * @param string $code
 * @return string
 */
function lw_member_register_hash_code( $code ) {
	return hash_hmac( 'sha256', (string) $code, wp_salt( 'auth' ) );
}

/**
 * 仮登録を作る
 *
 * @param array $values  ['login'=>, 'email'=>, 'name'=>]
 * @param array $profile プロフィール項目（検証済み）
 * @return array ['token'=>string, 'code'=>string] code はメールに載せる生の番号
 */
function lw_member_register_create_pending( $values, $profile ) {

	$token = wp_generate_password( 32, false );
	$code  = lw_member_register_make_code();

	set_transient(
		lw_member_register_pending_key( $token ),
		[
			'login'   => (string) $values['login'],
			'email'   => (string) $values['email'],
			'name'    => (string) $values['name'],
			'profile' => (array) $profile,
			'code'    => lw_member_register_hash_code( $code ),
			'tries'   => 0,
		],
		LW_MEMBER_REGISTER_PENDING_TTL
	);

	return [ 'token' => $token, 'code' => $code ];
}

/**
 * 仮登録を取り出す
 *
 * @param string $token 整形前でよい
 * @return array|false
 */
function lw_member_register_get_pending( $token ) {

	$token = lw_member_register_sanitize_token( $token );
	if ( $token === '' ) {
		return false;
	}

	$data = get_transient( lw_member_register_pending_key( $token ) );

	return ( is_array( $data ) && isset( $data['email'], $data['code'] ) ) ? $data : false;
}

/**
 * 仮登録を消す
 *
 * @param string $token
 * @return void
 */
function lw_member_register_delete_pending( $token ) {

	$token = lw_member_register_sanitize_token( $token );
	if ( $token !== '' ) {
		delete_transient( lw_member_register_pending_key( $token ) );
	}
}

/**
 * 認証番号を照合する
 *
 * 🚨 間違えた回数を数え、上限を超えたら仮登録ごと消す。
 *    これが無いと 000000〜999999 を総当たりされる。
 * 🚨 比較は hash_equals()。== だと、合っている桁数で時間が変わり、
 *    その差から番号を推測できてしまう（タイミング攻撃）。
 *
 * @param string $token
 * @param string $input 入力された番号
 * @return array|WP_Error 合っていれば仮登録の中身
 */
function lw_member_register_check_code( $token, $input ) {

	$data = lw_member_register_get_pending( $token );

	if ( ! $data ) {
		return new WP_Error(
			'lw_register_expired',
			'認証番号の有効期限が切れています。お手数ですが、最初からやり直してください。'
		);
	}

	$input = preg_replace( '/[^0-9]/', '', (string) $input );

	if ( $input === '' ) {
		return new WP_Error( 'code', '認証番号を入力してください。' );
	}

	if ( hash_equals( (string) $data['code'], lw_member_register_hash_code( $input ) ) ) {
		return $data;
	}

	/* 間違えた回数を数える。残りの有効期限は縮めない */
	$data['tries'] = (int) $data['tries'] + 1;
	$remaining     = LW_MEMBER_REGISTER_MAX_TRIES - $data['tries'];

	if ( $remaining <= 0 ) {
		lw_member_register_delete_pending( $token );
		return new WP_Error(
			'lw_register_expired',
			'認証番号を続けて間違えたため、この登録は無効になりました。お手数ですが、最初からやり直してください。'
		);
	}

	set_transient( lw_member_register_pending_key( lw_member_register_sanitize_token( $token ) ), $data, LW_MEMBER_REGISTER_PENDING_TTL );

	return new WP_Error( 'code', sprintf( '認証番号が違います。（あと%d回まで入力できます）', $remaining ) );
}
