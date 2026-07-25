<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // 直接アクセスを防止
}

/* ----------------------------------------------------------------
 * お問い合わせフォーム：添付ファイルの受理
 *
 * 🔒 送信口は wp_ajax_nopriv（未ログインで叩ける）で、nonce は公開ページに
 *    印字される共通値なので認証の役には立たない。したがって
 *    「フォーム定義に画像欄として登録されているキーだけを受理し、
 *      実データを検証し、サイズ・件数・流量を制限する」ことで守る。
 *
 * 🚨 拒否しても送信そのものは絶対に失敗させない（soft-drop）。
 *    画像欄だけのフォームでファイルを捨てると $form_array が空になり、
 *    mail-ajax.php の「フォームデータが正しく送信されていません。」に落ちて
 *    問い合わせ自体が消えるため、拒否時は理由の文字列を値として入れる。
 *
 * 🚨 reCAPTCHA は必須化しない（既定OFF・LINEアプリ内ブラウザでは常にOFF）。
 *    reCAPTCHA の有無を前提にしたゲートはここでは使わない。
 *
 * 形式判定 → upload_types.php ／ 流量制限 → upload_rate.php
 *----------------------------------------------------------------*/

/**
 * フォーム定義から「画像アップロード欄」の入力名一覧を作る。
 *
 * 対応規則は form_put.php:155 の name 生成と同じ（'form_' . (配列キー + 1)）。
 * 未選択項目（select_pattern=''）を詰めたり除去したりしないこと。詰めると
 * 公開中フォームの form_N の意味が全部ずれる。
 *
 * ⚠ 許可キーは「そのページのフォーム」ではなく「POST された form_set_no のフォーム定義」から
 *   作られる。サイト内のどこかのフォームセットに画像欄があれば、画像欄の無いページからでも
 *   添付は成立する（form_set_no は攻撃者が指定できる）。主防御は実データ検証とサイズ・流量。
 *
 * @param mixed $settings lw_mail_form_set_{n} を正規化した配列
 * @return array ['form_2' => true, ...]
 */
function lw_mail_form_image_field_keys( $settings ) {

	$keys = array();

	if ( is_array( $settings ) ) {
		foreach ( $settings as $idx => $st ) {

			/* 🔒 非数値キーに算術（$idx + 1）を掛けると PHP 8 で TypeError＝fatal になる。
			      lw-remote-manager 経由で任意の JSON が option に入り得るため必ず弾く。 */
			if ( ! is_int( $idx ) && ! preg_match( '/^[0-9]+$/', (string) $idx ) ) {
				continue;
			}
			if ( ! is_array( $st ) ) {
				continue;
			}
			$pattern = isset( $st['select_pattern'] ) ? $st['select_pattern'] : '';
			if ( $pattern !== 'image' ) {
				continue;
			}
			$keys[ 'form_' . ( (int) $idx + 1 ) ] = true;
		}
	}

	/* 独自HTMLで file input を置いているサイトの逃げ道（子テーマ・mu-plugin で救済可能にする）。
	   戻り値が配列でないとこの後の array_keys() で fatal になるため必ず検証する。 */
	$filtered = apply_filters( 'lw_mail_form_allowed_file_keys', $keys, $settings );

	return is_array( $filtered ) ? $filtered : $keys;
}

/**
 * $_FILES の1要素が「単一ファイルの正常な形」かを判定する。
 *
 * 🚨 name="form_1[]" のように送られると tmp_name / name / error / size が全部
 *    「配列」になる。この状態で getimagesize() や大小比較に渡すと PHP 8 は
 *    TypeError で fatal になり、匿名リクエストで問い合わせ窓口を 500 にできてしまう。
 *    （@ は TypeError を抑制しない）。よって検証の一番手前で形状を確認する。
 *
 * @param mixed $info
 * @return bool
 */
function lw_mail_form_is_valid_file_entry( $info ) {

	return is_array( $info )
		&& isset( $info['tmp_name'], $info['name'], $info['error'], $info['size'] )
		&& is_string( $info['tmp_name'] )
		&& is_string( $info['name'] )
		&& is_int( $info['error'] )
		&& is_int( $info['size'] );
}

/**
 * 受理できなかったことを伝える値を組み立てる。
 *
 * 素の文字列にしておくこと。下流（管理者メール本文・サンクスメールの [form_data]・
 * 受信履歴のJSON・CSV）はすべて「文字列 or 文字列の配列」しか想定していない。
 * 先頭が全角括弧なので CSV の数式無害化（mail_download_csv.php）にも触れない。
 *
 * @param string $reason
 * @param string $filename 送信されたファイル名（分かる場合）
 * @return string
 */
function lw_mail_form_upload_reject_note( $reason, $filename = '' ) {

	$name = sanitize_file_name( (string) $filename );
	$name = function_exists( 'mb_substr' ) ? mb_substr( $name, 0, 40 ) : substr( $name, 0, 40 );

	return ( $name !== '' )
		? '（添付ファイル「' . $name . '」は受理されませんでした：' . $reason . '）'
		: '（添付ファイルは受理されませんでした：' . $reason . '）';
}

/**
 * 受理候補と、受理せずに理由を残すものを仕分ける。
 *
 * ここでは保存も外部通信もカウンタの加算も一切しない
 * （流量制限・reCAPTCHA を通す前に呼ばれるため）。
 *
 * @param mixed $settings lw_mail_form_set_{n} を正規化した配列
 * @return array ['keys' => 許可キー, 'files' => 受理候補, 'rejects' => キー => 理由文]
 */
function lw_mail_form_collect_uploads( $settings ) {

	$plan = array(
		'keys'    => lw_mail_form_image_field_keys( $settings ),
		'files'   => array(),
		'rejects' => array(),
	);

	if ( empty( $_FILES ) || ! is_array( $_FILES ) ) {
		return $plan;
	}

	foreach ( $_FILES as $key => $info ) {

		/* 定義済みの画像欄以外は黙って捨てる（form_9999 等の投げ込みを受け付けない） */
		if ( ! is_string( $key ) || ! isset( $plan['keys'][ $key ] ) ) {
			continue;
		}

		/* 🚨 配列形状（form_N[]）はここで必ず止める。以降の検証に配列を渡すと fatal になる。
		      独自HTMLで複数選択にしているサイトが気付けるよう理由は残す。 */
		if ( ! lw_mail_form_is_valid_file_entry( $info ) ) {
			$plan['rejects'][ $key ] = lw_mail_form_upload_reject_note( '複数ファイルの同時送信には対応していないため' );
			continue;
		}

		/* 未選択の欄はブラウザが空パートを送ってくる＝従来どおり無言でスキップ */
		if ( $info['error'] === UPLOAD_ERR_NO_FILE ) {
			continue;
		}

		/* サーバ側（php.ini）で弾かれた分。従来は黙って消えていたので理由を残す */
		if ( $info['error'] !== UPLOAD_ERR_OK ) {
			if ( UPLOAD_ERR_INI_SIZE === $info['error'] || UPLOAD_ERR_FORM_SIZE === $info['error'] ) {
				$reason = 'ファイルサイズがサーバーの上限（' . size_format( lw_mail_form_upload_max_size() ) . '）を超えたため';
			} else {
				$reason = 'アップロードが完了しなかったため';
			}
			$plan['rejects'][ $key ] = lw_mail_form_upload_reject_note( $reason, $info['name'] );
			continue;
		}

		if ( ! is_uploaded_file( $info['tmp_name'] ) ) {
			continue;
		}

		$plan['files'][ $key ] = $info;
	}

	return $plan;
}

/**
 * 受理候補を検証して保存し、$form_array に反映する。
 *
 * @param array $form_array   組み立て済みのフォーム値
 * @param array $plan         lw_mail_form_collect_uploads() の結果
 * @param bool  $rate_blocked 流量制限に当たっているか
 * @return array $form_array
 */
function lw_mail_form_store_uploads( $form_array, $plan, $rate_blocked = false ) {

	if ( ! is_array( $form_array ) ) {
		$form_array = array();
	}
	$rejects = isset( $plan['rejects'] ) && is_array( $plan['rejects'] ) ? $plan['rejects'] : array();
	$keys    = isset( $plan['keys'] ) && is_array( $plan['keys'] ) ? $plan['keys'] : array();
	$files   = isset( $plan['files'] ) && is_array( $plan['files'] ) ? $plan['files'] : array();

	/* 🚨 画像欄のキーは POST のテキスト値を採用しない。
	      攻撃者が form_3=https://evil.example/x.pdf と送ると、添付URLのふりをした
	      外部URLが管理者メール・サンクスメール・受信履歴に残ってしまう。
	      旧 form_data JSON 経路では 'form_3[]' というキー名も来るので併せて外す。 */
	foreach ( array_keys( $keys ) as $key ) {
		foreach ( array( $key, $key . '[]' ) as $post_key ) {
			if ( ! isset( $form_array[ $post_key ] ) ) {
				continue;
			}
			/* 値が入っていたなら黙って消さない（キャッシュされた旧HTMLから
			   テキスト回答が届いたときに痕跡なく失われるのを防ぐ） */
			if ( $form_array[ $post_key ] !== '' && $form_array[ $post_key ] !== array() && ! isset( $rejects[ $key ] ) ) {
				$rejects[ $key ] = lw_mail_form_upload_reject_note( '添付ファイル欄にテキストが送信されたため' );
			}
			unset( $form_array[ $post_key ] );
		}
	}

	if ( ! empty( $files ) ) {

		if ( $rate_blocked ) {

			foreach ( $files as $key => $info ) {
				$rejects[ $key ] = lw_mail_form_upload_reject_note( '添付の受付を一時的に制限しているため', $info['name'] );
			}

		} else {

			require_once ABSPATH . 'wp-admin/includes/file.php';

			/* 実際に受理処理へ進むこの時点で1回として数える（reCAPTCHA 通過後） */
			lw_mail_form_count_upload_submission();

			$max_size  = lw_mail_form_upload_max_size();
			$max_files = (int) apply_filters( 'lw_mail_form_upload_max_files', 10 );
			$mimes     = lw_mail_form_upload_mimes();
			$accepted  = 0;

			foreach ( $files as $key => $info ) {

				if ( $max_files > 0 && $accepted >= $max_files ) {
					$rejects[ $key ] = lw_mail_form_upload_reject_note( '1回に送信できる添付の上限（' . $max_files . '件）を超えたため', $info['name'] );
					continue;
				}
				if ( $info['size'] > $max_size ) {
					$rejects[ $key ] = lw_mail_form_upload_reject_note( 'ファイルサイズが上限（' . size_format( $max_size ) . '）を超えたため', $info['name'] );
					continue;
				}

				/* 形式の判定はバイト予算を使う前に行う。
				   拒否されるファイルは1バイトも保存されないので予算から引いてはいけない。 */
				$ext = lw_mail_form_detect_upload_extension( $info );
				if ( $ext === '' ) {
					$rejects[ $key ] = lw_mail_form_upload_reject_note( '対応していないファイル形式のため（画像とPDFのみ受け付けています）', $info['name'] );
					continue;
				}

				if ( ! lw_mail_form_reserve_upload_bytes( $info['size'] ) ) {
					$rejects[ $key ] = lw_mail_form_upload_reject_note( '添付の受付を一時的に制限しているため', $info['name'] );
					continue;
				}

				/* 拡張子は実データ由来のものに差し替えてから WP に渡す。
				   test_form => false は必須（$_POST['action'] が 'lw_mail_form_submit' のため）。
				   wp_handle_upload 自体は維持する（wp_handle_upload_prefilter で
				   セキュリティプラグインが介入できる経路を潰さない）。 */
				$original     = $info['name'];
				$info['name'] = lw_mail_form_safe_upload_filename( $original, $ext );
				$upload       = wp_handle_upload( $info, array( 'test_form' => false, 'mimes' => $mimes ) );

				if ( ! empty( $upload['url'] ) ) {
					$form_array[ $key ] = $upload['url'];
					$accepted++;
				} else {
					$rejects[ $key ] = lw_mail_form_upload_reject_note( 'サーバー側で保存できなかったため', $original );
					if ( defined( 'WP_DEBUG' ) && WP_DEBUG && ! empty( $upload['error'] ) ) {
						error_log( '[LW Mail Form] wp_handle_upload 失敗: ' . $key . ' / ' . $upload['error'] );
					}
				}
			}
		}
	}

	/* 🚨 拒否した欄には必ず文字列を入れる。
	      値を入れずに空のままにすると、画像欄だけのフォームで $form_array が空になり
	      mail-ajax.php の empty() 判定に落ちて問い合わせ自体が届かなくなる。 */
	foreach ( $rejects as $key => $note ) {
		if ( isset( $form_array[ $key ] ) && $form_array[ $key ] !== '' ) {
			continue; // 保存に成功した値は上書きしない
		}
		$form_array[ $key ] = $note;

		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( '[LW Mail Form] 添付を受理しませんでした: ' . $key . ' / ' . $note );
		}
	}

	return $form_array;
}
