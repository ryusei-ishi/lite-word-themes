<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセスを防止
}

/* ----------------------------------------------------------------
 * 共通：get_option() + 既定値 + エスケープ
 *----------------------------------------------------------------*/
function get_option_with_default( $key, $default = '' ) {
	$val = get_option( $key, '__lw_null__' );
	if ( $val === '__lw_null__' || trim( $val ) === '' ) {
		return esc_html( $default );
	}
	return esc_html( $val );
}

/* ----------------------------------------------------------------
 * Ajax : メールフォーム送信
 *----------------------------------------------------------------*/
function lw_mail_form_submit() {

	/* === CSRF チェック === */
	check_ajax_referer( 'lw_mail_form_nonce', 'nonce' );

	/* === フォームセット番号必須 === */
	if ( empty( $_POST['lw_mail_form_set_no'] ) ) {
		wp_send_json_error( [ 'message' => 'フォームセット番号がありません。' ] );
	}
	$form_set_no = sanitize_text_field( $_POST['lw_mail_form_set_no'] );
	/* === フォームの有効状態をチェック === */
	if (!lw_is_form_enabled($form_set_no)) {
		wp_send_json_error([
			'message' => 'このフォームは現在ご利用いただけません。'
		]);
		wp_die();
	}
	/* === 送信元ページ情報 === */
	$post_id     = isset( $_POST['lw_current_post_id'] ) ? intval( $_POST['lw_current_post_id'] ) : 0;
	$post_title  = $post_id ? get_the_title( $post_id )  : '';
	$post_author = $post_id ? intval( get_post_field( 'post_author', $post_id ) ) : 0;

	/* === フォームデータを組み立て ================================ */
	$form_array = [];

	/* 1) 旧 send.js（application/x-www-form-urlencoded + form_data） */
	if ( isset( $_POST['form_data'] ) ) {
		$form_array = json_decode( stripslashes( $_POST['form_data'] ), true ) ?: [];
	}

	/* 2) 新 send.js（multipart 送信：POSTキーを直接拾う） */
	if ( empty( $form_array ) ) {
		foreach ( $_POST as $k => $v ) {
			if ( strpos( $k, 'form_' ) === 0 ) {
				$form_array[ $k ] = $v;     // チェックボックスは [] が付く → 後でマージ
			}
		}
	}

	/* 3) アップロードされた画像ファイルを処理（任意） */
	if ( ! empty( $_FILES ) ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		foreach ( $_FILES as $key => $info ) {
			if ( strpos( $key, 'form_' ) !== 0 || $info['error'] !== UPLOAD_ERR_OK ) continue;
			$upload = wp_handle_upload( $info, [ 'test_form' => false ] );
			if ( ! empty( $upload['url'] ) ) {
				/* 画像 URL を値として保持（メール／履歴にそのまま出力可能） */
				$form_array[ $key ] = $upload['url'];
			}
		}
	}

	if ( empty( $form_array ) || ! is_array( $form_array ) ) {
		wp_send_json_error( [ 'message' => 'フォームデータが正しく送信されていません。' ] );
	}

	/* === reCAPTCHA（任意） === */
	if ( can_use_recaptcha() ) {
		$token = isset( $_POST['g-recaptcha-response'] ) ? sanitize_text_field( $_POST['g-recaptcha-response'] ) : '';
		if ( ! $token ) {
			wp_send_json_error( [ 'message' => 'reCAPTCHAトークンがありません。' ] );
		}
		$secret = get_option( 'lw_form_recaptcha_secret_key', '' );
		$verify = wp_remote_get(
			add_query_arg(
				[ 'secret' => $secret, 'response' => $token ],
				'https://www.google.com/recaptcha/api/siteverify'
			)
		);
		$body = json_decode( wp_remote_retrieve_body( $verify ), true );
		if ( empty( $body['success'] ) || ( isset( $body['score'] ) && $body['score'] < 0.5 ) ) {
			wp_send_json_error( [ 'message' => 'reCAPTCHA の検証に失敗しました。' ] );
		}
		unset( $form_array['g-recaptcha-response'] );
	}

	/* === 不要キー削除 & サニタイズ === */
	unset(
		$form_array['lw_mail_nonce'],
		$form_array['_wp_http_referer'],
		$form_array['lw_mail_form_set_no'],
		 $form_array['lw_current_post_id'] 
	);
	$clean = [];
	foreach ( $form_array as $k => $v ) {
		$clean[ $k ] = is_array( $v )
			? array_map( 'sanitize_textarea_field', $v )
			: sanitize_textarea_field( $v );
	}

	/* === 設定に保存してあるフォーム項目情報 === */
	$settings_raw = get_option( "lw_mail_form_set_{$form_set_no}", [] );
	$settings     = is_string( $settings_raw ) ? json_decode( $settings_raw, true ) : $settings_raw;

/* === 設定に保存してあるフォーム項目情報 === */
$label_map = [];
$sc_map    = [];

if ( is_array( $settings ) ) {
	foreach ( $settings as $idx => $st ) {

		$fname = 'form_' . ( $idx + 1 );   // form_1 / form_2 …

		/* ---------- ラベル ---------- */
		if ( ! empty( $st['label_text'] ) ) {
			$label_map[ $fname ] = esc_html( $st['label_text'] );
			$label_map[ $fname . '[]' ] = esc_html( $st['label_text'] ); 
		}

		/* ---------- ショートコード ---------- */
		if ( ! empty( $st['shortcode'] ) ) {

			$sc_key = trim( $st['shortcode'] );   // ex) your_mail, tel …

			// ▼▼ ここがポイント ▼▼
			if ( isset( $clean[ $fname ] ) ) {                   // テキスト・ラジオなど
				$sc_val = $clean[ $fname ];
			} elseif ( isset( $clean[ $fname . '[]' ] ) ) {      // チェックボックスは [] が付く
				$sc_val = $clean[ $fname . '[]' ];
			} else {
				$sc_val = '';                                    // 未入力でもキーは登録
			}

			$sc_map[ $sc_key ] = $sc_val;
		}
	}
}


	/* -------------------------------
	 * 管理者用メール
	 *-------------------------------*/
	$blog_name        = get_bloginfo( 'name' );
	$admin_mail       = get_option( 'admin_email' );
	$default_from     = 'wordpress@' . wp_parse_url( home_url(), PHP_URL_HOST );

	$admin_to      = get_option_with_default( "form_send_set_{$form_set_no}_to_mail", $admin_mail );
	$admin_subject = get_option_with_default(
		"form_send_set_{$form_set_no}_subject",
		$blog_name . 'のホームページからお問い合わせがありました。'
	);
	$from_name = get_option_with_default(
		"form_send_set_{$form_set_no}_from_name",
		$blog_name
	);
	$from_mail = get_option_with_default(
		"form_send_set_{$form_set_no}_from_mail",
		$default_from
	);

	/* 本文 HTML */
	$keys = array_keys( $clean );
	$last = end( $keys );

	$admin_body  = '<html><body style="font-family:Arial, sans-serif;line-height:1.6;">';
	$admin_body .= '<p style="margin:0 0 16px;">以下の内容でお問い合わせがありました。</p>';

	foreach ( $clean as $k => $v ) {
		$base  = str_replace( '[]', '', $k );
		$label = $label_map[ $k ] ?? $label_map[ $base ] ?? $k;
		$admin_body .= '<div style="margin-bottom:12px;">';
		$admin_body .= '<strong style="display:flex;align-items:center;color:#333;">'
		             . '<span style="display:inline-block;width:12px;height:12px;background:#333;margin-right:6px;margin-top:3px;"></span>'
		             . esc_html( $label )
		             . '</strong>';
		if ( is_array( $v ) ) {
			$admin_body .= '<ul style="margin:6px 0 0 18px;padding:0;">';
			foreach ( $v as $item ) {
				$admin_body .= '<li style="list-style-type:disc;">'  . nl2br( esc_html( $item ), false ) .  '</li>';
			}
			$admin_body .= '</ul>';
		} else {
			$admin_body .= '<span style="display:block;margin-top:6px;">'  . nl2br( esc_html( $v ), false ) .  '</span>';
		}
		$admin_body .= '</div>';
		if ( $k !== $last ) {
			$admin_body .= '<hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">';
		}
	}
	$admin_body .= '</body></html>';

	$admin_headers = [
		'Content-Type: text/html; charset=UTF-8',
		"From: {$from_name} <{$from_mail}>"
	];

	/* -------------------------------
	* 10 パターン分のサンクスメール
	*-------------------------------*/
	$mail_form_thanks_mail_switch = Lw_theme_mod_set("lw_extensions_mail_form_thanks_mail_switch", "on");
	if ( $mail_form_thanks_mail_switch == 'on' ) {
		for ( $i = 1; $i <= 5; $i ++ ) {
	
			/* ── スイッチ判定 ── */
			if ( get_option( "form_send_thanks_{$i}_{$form_set_no}_switch", 'off' ) !== 'on' ) {
				continue;
			}
	
			/* ── テンプレ取得 ── */
			$subj_tpl = get_option_with_default(
				"form_send_thanks_{$i}_{$form_set_no}_subject",
				'【自動返信】お問い合わせありがとうございます'
			);
			$body_tpl = get_option_with_default(
				"form_send_thanks_{$i}_{$form_set_no}_body",
				"[your_name] 様\n\nこの度は {$blog_name} へお問い合わせいただき誠にありがとうございます。\n\n[form_data]\n\n※本メールは自動送信です。"
			);
			$to_tpl  = get_option_with_default( "form_send_thanks_{$i}_{$form_set_no}_to_mail",   '[your_mail]' );
			$fnm_tpl = get_option_with_default( "form_send_thanks_{$i}_{$form_set_no}_from_name","{$blog_name} 担当者" );
			$fml_tpl = get_option_with_default( "form_send_thanks_{$i}_{$form_set_no}_from_mail", $default_from );
	
			/* ── ショートコード置換 ── */
			$replace = function ( $tpl ) use ( $sc_map ) {
				foreach ( $sc_map as $sc => $val ) {
					$val = is_array( $val ) ? implode( ', ', array_map( 'esc_html', $val ) ) : esc_html( $val );
					$tpl = str_replace( '[' . $sc . ']', $val, $tpl );
				}
				return $tpl;
			};
			$subject = $replace( $subj_tpl );
			$body    = $replace( $body_tpl );
			$to_addr = $replace( $to_tpl );
			$from_nm = $replace( $fnm_tpl );
			$from_ml = $replace( $fml_tpl );
	
			/* ── [form_data] 展開 ── */
			if ( strpos( $body, '[form_data]' ) !== false ) {
				$txt = '';
				foreach ( $clean as $k => $v ) {
					$lbl = $label_map[ $k ] ?? $k;
					if ( is_array( $v ) ) {
						$txt .= $lbl . ":\n  - " . implode( "\n  - ", array_map( 'esc_html', $v ) ) . "\n\n";
					} else {
						$txt .= $lbl . ': ' . esc_html( $v ) . "\n\n";
					}
				}
				$body = str_replace( '[form_data]', $txt, $body );
			}
	
			/* ── 宛先判定 ── */
			$recipients = array_filter( preg_split( '/[;,]+/', trim( $to_addr ) ), 'is_email' );
			if ( empty( $recipients ) ) continue;
	
			/* ── 行間 1.8em の HTML 本文へ変換 ── */
			$body_html = '<html><body style="font-family:Arial, sans-serif; line-height:1.8;">'
					. nl2br( esc_html( $body ), false )
					. '</body></html>';
	
			/* ── ヘッダー ── */
			$thanks_headers = [
				'Content-Type: text/html; charset=UTF-8',
				"From: {$from_nm} <{$from_ml}>"
			];
	
			/* ── 送信 ── */
			wp_mail( $recipients, $subject, $body_html, $thanks_headers );
		}
	}

	/* -------------------------------
	 * 管理者へ送信
	 *-------------------------------*/
	$admin_sent = wp_mail( $admin_to, $admin_subject, $admin_body, $admin_headers );
	$data_for_save = [];
	$done_labels   = [];   // チェックボックス用の重複回避

	foreach ( $label_map as $form_key => $label ) {

		/* チェックボックスは form_X と form_X[] の２キーが来るので
		すでに同じラベルを処理済みならスキップ           */
		if ( isset( $done_labels[ $label ] ) ) {
			continue;
		}
		$done_labels[ $label ] = true;

		/* フォーム値（未入力なら ''） */
		$value = $clean[ $form_key ] ?? '';

		$data_for_save[ $label ] = $value;
	}
	if(LW_EXPANSION_BASE){
		$mail_form_reception_history_switch = Lw_theme_mod_set("lw_extensions_mail_form_reception_history_switch", "off");
		if($mail_form_reception_history_switch == "on") {
			lw_save_mail_reception_history( [
				'subject'     => $admin_subject,
				'form_set_no' => (int) $form_set_no,
				'data'        => $data_for_save,   // ← ここを変更
				'post_id'     => $post_id,
				'post_title'  => $post_title,
				'post_author' => $post_author,
			] );
		}
	}
	/* -------------------------------
	 * レスポンス
	 *-------------------------------*/
	if ( $admin_sent ) {

		$thanks_url = get_option_with_default( "form_thanks_page_set_{$form_set_no}_thanks_page_url", '' );
		$popup      = '
			<div class="lw_mail_send_completion_popup">
				<div class="in">
					<p>お問い合わせ内容が送信されました。</p>
				</div>
			</div>';

		if ( $thanks_url ) {
			wp_send_json_success( [ 'message' => $popup ] );
		}

		// サンクス URL 未設定の場合
		$popup_no_url = '
			<div class="lw_mail_send_completion_popup">
				<div class="in">
					<p>お問い合わせが送信されました。</p>
					<a href="' . esc_url( home_url() ) . '">
						トップへ
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5 12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
					</a>
				</div>
			</div>';
		wp_send_json_success( [ 'message' => $popup_no_url ] );
	}

	wp_send_json_error( [ 'message' => '送信に失敗しました。' ] );
}
add_action( 'wp_ajax_lw_mail_form_submit',        'lw_mail_form_submit' );
add_action( 'wp_ajax_nopriv_lw_mail_form_submit', 'lw_mail_form_submit' );
/* -------------------------------
* メール受信履歴の保存
*-------------------------------*/
require_once get_theme_file_path( 'functions/mail_form/reception_history.php' );





