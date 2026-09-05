<?php
/**
 * 追従CTA パターン11（メール登録フォーム）専用のリード受付。
 * ------------------------------------------------------------------
 * mail_form の受信履歴テーブル（wp_lw_mail_reception_history）に相乗りするが、
 * このファイルは mail_form 本体とは完全に独立している（mail_form が
 * lw_extensions_mail_form_switch_all で無効化されていても通知メールは送れる）。
 *
 * 保存の可否は mail_form 側の「受信履歴の保存」スイッチに依存させない。
 * このパターン自身にとって、届いたメールアドレスの一覧は付随機能ではなく
 * 主要な記録用途のため、常時保存する（mail_form サブシステム自体が
 * 無効化されている場合のみ保存されない＝その場合も通知メールは飛ぶ）。
 */
if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! defined( 'LW_CTA_LEAD_FORM_SET_NO' ) ) {
	define( 'LW_CTA_LEAD_FORM_SET_NO', 9011 ); // mail_form の実フォーム番号(1-40)とは重ならない予約番号
}

/* ----------------------------------------------------------------
 * 送信元IP・簡易レート制限（多層防御の外側の1枚。mail_form側とは独立させる）
 *----------------------------------------------------------------*/
function lw_cta_lead_client_ip() {
	$ip = ( ! empty( $_SERVER['REMOTE_ADDR'] ) && is_string( $_SERVER['REMOTE_ADDR'] ) ) ? trim( $_SERVER['REMOTE_ADDR'] ) : '';
	if ( $ip === '' || ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
		return '';
	}
	if ( ! filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) ) {
		return ''; // プロキシ配下＝訪問者を区別できないので fail open
	}
	if ( strpos( $ip, ':' ) !== false && function_exists( 'inet_pton' ) ) {
		$packed = @inet_pton( $ip );
		if ( $packed !== false && strlen( $packed ) === 16 ) {
			return 'v6-' . bin2hex( substr( $packed, 0, 8 ) );
		}
	}
	return $ip;
}

function lw_cta_lead_rate_ok() {
	if ( current_user_can( 'manage_options' ) ) {
		return true;
	}
	$ip = lw_cta_lead_client_ip();
	if ( $ip === '' ) {
		return true; // fail open（共有IP・プロキシ配下）
	}
	return ( (int) get_transient( 'lw_cta_lead_rt_' . md5( $ip ) ) ) < 8;
}

function lw_cta_lead_count_submission() {
	if ( current_user_can( 'manage_options' ) ) {
		return;
	}
	$ip = lw_cta_lead_client_ip();
	if ( $ip === '' ) {
		return;
	}
	$key = 'lw_cta_lead_rt_' . md5( $ip );
	set_transient( $key, ( (int) get_transient( $key ) ) + 1, 10 * MINUTE_IN_SECONDS );
}

/* ----------------------------------------------------------------
 * Ajax：追従CTA(ptn_11) のメール登録
 *----------------------------------------------------------------*/
function lw_cta_lead_submit() {

	check_ajax_referer( 'lw_cta_lead_nonce', 'nonce' );

	// 🚨 多層防御：この画面自体はptn_11がプレミアム限定のサイトにしか出さない前提だが、
	//    それは「nonceがそのページにしか無い」という間接的な保証でしかない
	//    （長時間キャッシュされたページ経由でnonceが漏れる等の懸念）。
	//    Ajaxハンドラ自身でも明示的にサブスク状態を見る（2026-09-04セキュリティレビューで指摘）。
	if ( ! ( defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true ) ) {
		wp_send_json_error( [ 'message' => 'この機能は現在ご利用いただけません。' ] );
	}

	// ハニーポット：人には見えない欄。埋まっていればbotなので、成功したように見せて何もしない
	if ( ! empty( $_POST['lw_cta_lead_hp'] ) ) {
		wp_send_json_success( [ 'message' => '送信しました。' ] );
	}

	if ( ! lw_cta_lead_rate_ok() ) {
		wp_send_json_error( [ 'message' => 'しばらく時間をおいてから、もう一度お試しください。' ] );
	}

	$email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	if ( ! is_email( $email ) ) {
		wp_send_json_error( [ 'message' => '正しいメールアドレスを入力してください。' ] );
	}

	lw_cta_lead_count_submission();

	$post_id    = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;
	$post_title = $post_id ? get_the_title( $post_id ) : '';

	/* -------------------------------
	 * 通知メール（既定＝管理者メール。届く保証をこの1本に置く）
	 *-------------------------------*/
	$blog_name    = get_bloginfo( 'name' );
	$default_from = 'wordpress@' . wp_parse_url( home_url(), PHP_URL_HOST );

	$notify_to = trim( (string) Lw_theme_mod_set( 'follow_bottom_cta_ptn_11_set_notify_email', '' ) );
	if ( ! is_email( $notify_to ) ) {
		$notify_to = get_option( 'admin_email' );
	}

	$subject   = $blog_name . ' の追従フォームからメール登録がありました';
	$page_line = $post_id
		? esc_html( $post_title ) . '（' . esc_url( get_permalink( $post_id ) ) . '）'
		: esc_html( home_url( '/' ) );

	$body  = '<html><body style="font-family:Arial, sans-serif;line-height:1.6;">';
	$body .= '<p style="margin:0 0 16px;">追従CTA（メール登録フォーム）から、以下のメールアドレスの登録がありました。</p>';
	$body .= '<div style="margin-bottom:12px;"><strong style="color:#333;">メールアドレス</strong><span style="display:block;margin-top:6px;">' . esc_html( $email ) . '</span></div>';
	$body .= '<div style="margin-bottom:12px;"><strong style="color:#333;">送信元ページ</strong><span style="display:block;margin-top:6px;">' . $page_line . '</span></div>';
	$body .= '</body></html>';

	$headers = [
		'Content-Type: text/html; charset=UTF-8',
		"From: {$blog_name} <{$default_from}>",
	];

	$mail_sent = wp_mail( $notify_to, $subject, $body, $headers );

	/* -------------------------------
	 * 記録（mail_form サブシステムが有効なサイトでは常に保存する）
	 *-------------------------------*/
	$history_saved = false;
	if ( function_exists( 'lw_save_mail_reception_history' ) ) {
		lw_save_mail_reception_history( [
			'subject'     => $subject,
			'form_set_no' => LW_CTA_LEAD_FORM_SET_NO,
			'data'        => [ 'メールアドレス' => $email ],
			'post_id'     => $post_id,
			'post_title'  => $post_title,
			'post_author' => $post_id ? intval( get_post_field( 'post_author', $post_id ) ) : 0,
		] );
		$history_saved = true;
	}

	if ( ! $mail_sent && ! $history_saved ) {
		// 通知メールも記録も両方失敗＝訪問者の入力を無駄にしないよう、はっきり失敗を返す
		// 🚨 宛先メールアドレスそのものはログに残さない（debug.logが誤って公開状態のサイトがあるため）
		error_log( '[LW CTA Lead] 通知メール送信・記録の両方に失敗しました。' );
		wp_send_json_error( [ 'message' => '送信に失敗しました。時間をおいてもう一度お試しください。' ] );
	}

	if ( ! $mail_sent ) {
		error_log( '[LW CTA Lead] 通知メール送信に失敗しました（記録は保存済み）。' );
	}

	wp_send_json_success( [ 'message' => '送信しました。ありがとうございます。' ] );
}
add_action( 'wp_ajax_lw_cta_lead_submit', 'lw_cta_lead_submit' );
add_action( 'wp_ajax_nopriv_lw_cta_lead_submit', 'lw_cta_lead_submit' );

/* ----------------------------------------------------------------
 * 管理画面：追従CTAリード一覧
 * 🚨 プレミアム会員（LW_HAS_SUBSCRIPTION）のサイトにしかメニューを出さない。
 *    ptn_11自体がプレミアム限定のため、それ以外のサイトには何も増やさない。
 *----------------------------------------------------------------*/
add_action( 'admin_menu', 'lw_cta_lead_admin_menu' );
function lw_cta_lead_admin_menu() {
	if ( ! ( defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true ) ) {
		return;
	}
	// 🚨 「Lwお問い合わせ」メニュー自体は mail_form サブシステムが有効なサイトにしか無い
	//    （functions/index.php の lw_extensions_mail_form_switch_all）。
	//    それがオフのサイトでも「追従CTAリード」画面自体はこのファイル単独で機能するため、
	//    親メニューが無いときは独立メニューとして登録し、必ずどこかから辿れるようにする
	//    （2026-09-04レビューで「親メニューが無いと画面がどこにも表示されない」と指摘された）。
	if ( Lw_theme_mod_set( 'lw_extensions_mail_form_switch_all', 'on' ) === 'on' ) {
		add_submenu_page(
			'lw_mail_form_set',
			'追従CTAリード',
			'追従CTAリード',
			'manage_options',
			'lw_cta_lead_list',
			'lw_cta_lead_render_admin_page'
		);
		return;
	}
	add_menu_page(
		'追従CTAリード',
		'追従CTAリード',
		'manage_options',
		'lw_cta_lead_list',
		'lw_cta_lead_render_admin_page',
		'dashicons-email-alt',
		23
	);
}

function lw_cta_lead_render_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) return;

	if ( ! function_exists( 'lw_ensure_mail_reception_history_table' ) ) {
		echo '<div class="wrap"><h1>追従CTAリード</h1><div class="notice notice-error"><p>この一覧を使うには「Lwお問い合わせ」機能を有効にしてください。カスタマイザーの「拡張機能」設定で「メールフォーム機能」がオフになっていないかご確認ください。（通知メール自体はこの設定に関係なく届きます）</p></div></div>';
		return;
	}

	global $wpdb;
	$table        = $wpdb->prefix . 'lw_mail_reception_history';
	$per_page     = 20;
	$current_page = isset( $_GET['paged'] ) ? max( 1, (int) $_GET['paged'] ) : 1;

	$total = (int) $wpdb->get_var( $wpdb->prepare(
		"SELECT COUNT(*) FROM {$table} WHERE form_set_no = %d",
		LW_CTA_LEAD_FORM_SET_NO
	) );

	$rows = [];
	if ( $total > 0 ) {
		$offset = ( $current_page - 1 ) * $per_page;
		$rows   = $wpdb->get_results( $wpdb->prepare(
			"SELECT id, created_at, post_id, post_title, body FROM {$table} WHERE form_set_no = %d ORDER BY id DESC LIMIT %d OFFSET %d",
			LW_CTA_LEAD_FORM_SET_NO, $per_page, $offset
		) );
	}
	$total_pages = $total > 0 ? (int) ceil( $total / $per_page ) : 1;

	$csv_url     = wp_nonce_url( admin_url( 'admin-post.php?action=lw_cta_lead_csv' ), 'lw_cta_lead_admin_nonce' );
	$del_all_url = wp_nonce_url( admin_url( 'admin-post.php?action=lw_cta_lead_del_all' ), 'lw_cta_lead_admin_nonce' );
	?>
	<div class="wrap">
		<h1>追従CTAリード（メール登録フォーム）</h1>
		<p>追従CTAの「メール登録フォーム」パターンから届いたメールアドレスの一覧です。届いた時点で設定した宛先へ通知メールも送信されています。</p>
		<p>
			<a href="<?= esc_url( $csv_url ) ?>" class="button"<?= $total === 0 ? ' style="pointer-events:none;opacity:.5;"' : '' ?>>CSVダウンロード（全<?= number_format( $total ) ?>件）</a>
			<a href="<?= esc_url( $del_all_url ) ?>" class="button" style="margin-left:8px;background:#dc3232;color:#fff;<?= $total === 0 ? 'pointer-events:none;opacity:.5;' : '' ?>" onclick="return confirm('すべて削除します。よろしいですか？');">すべて削除</a>
		</p>
		<?php if ( ! $total ) : ?>
			<p>まだ登録がありません。</p>
		<?php else : ?>
			<table class="widefat striped">
				<thead>
					<tr>
						<th style="width:160px;">日時</th>
						<th>メールアドレス</th>
						<th>送信元ページ</th>
						<th style="width:80px;">操作</th>
					</tr>
				</thead>
				<tbody>
				<?php foreach ( $rows as $r ) :
					$body_arr = json_decode( $r->body, true ) ?: [];
					$email    = $body_arr['メールアドレス'] ?? '';
					$del_url  = wp_nonce_url( admin_url( 'admin-post.php?action=lw_cta_lead_del_row&row_id=' . (int) $r->id ), 'lw_cta_lead_admin_nonce' );
				?>
					<tr>
						<td><?= esc_html( mysql2date( 'Y-m-d H:i', $r->created_at ) ) ?></td>
						<td><?= esc_html( $email ) ?></td>
						<td><?= $r->post_id ? '<a href="' . esc_url( get_permalink( $r->post_id ) ) . '" target="_blank" rel="noopener">' . esc_html( $r->post_title ) . '</a>' : '-' ?></td>
						<td><a href="<?= esc_url( $del_url ) ?>" onclick="return confirm('削除しますか？');">削除</a></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			<?php if ( $total_pages > 1 ) : ?>
				<p style="margin-top:12px;">
				<?php for ( $p = 1; $p <= $total_pages; $p++ ) :
					if ( $p === $current_page ) : ?>
						<strong style="margin-right:8px;"><?= $p ?></strong>
					<?php else : ?>
						<a href="<?= esc_url( add_query_arg( [ 'paged' => $p ] ) ) ?>" style="margin-right:8px;"><?= $p ?></a>
					<?php endif;
				endfor; ?>
				</p>
			<?php endif; ?>
		<?php endif; ?>
	</div>
	<?php
}

/* ----------------------------------------------------------------
 * 削除・CSV（追従CTAリード専用。mail_form側の同種処理とは独立させ、
 * 削除後の戻り先などをこの一覧ページに固定する）
 *----------------------------------------------------------------*/
add_action( 'admin_post_lw_cta_lead_del_row', function () {
	if ( ! current_user_can( 'manage_options' ) ) wp_die( '権限がありません。' );
	check_admin_referer( 'lw_cta_lead_admin_nonce' );
	global $wpdb;
	$row_id = intval( $_GET['row_id'] ?? 0 );
	if ( $row_id ) {
		$wpdb->delete(
			$wpdb->prefix . 'lw_mail_reception_history',
			[ 'id' => $row_id, 'form_set_no' => LW_CTA_LEAD_FORM_SET_NO ],
			[ '%d', '%d' ]
		);
	}
	wp_safe_redirect( admin_url( 'admin.php?page=lw_cta_lead_list' ) );
	exit;
} );

add_action( 'admin_post_lw_cta_lead_del_all', function () {
	if ( ! current_user_can( 'manage_options' ) ) wp_die( '権限がありません。' );
	check_admin_referer( 'lw_cta_lead_admin_nonce' );
	global $wpdb;
	$wpdb->delete(
		$wpdb->prefix . 'lw_mail_reception_history',
		[ 'form_set_no' => LW_CTA_LEAD_FORM_SET_NO ],
		[ '%d' ]
	);
	wp_safe_redirect( admin_url( 'admin.php?page=lw_cta_lead_list' ) );
	exit;
} );

add_action( 'admin_post_lw_cta_lead_csv', function () {
	if ( ! current_user_can( 'manage_options' ) ) wp_die( '権限がありません。' );
	check_admin_referer( 'lw_cta_lead_admin_nonce' );

	global $wpdb;
	$table = $wpdb->prefix . 'lw_mail_reception_history';
	$rows  = $wpdb->get_results( $wpdb->prepare(
		"SELECT created_at, post_id, post_title, body FROM {$table} WHERE form_set_no = %d ORDER BY id DESC",
		LW_CTA_LEAD_FORM_SET_NO
	) );
	if ( ! $rows ) wp_die( 'データが見つかりませんでした。' );

	header( 'Content-Type: text/csv; charset=UTF-8' );
	header( 'Content-Disposition: attachment; filename="cta_lead_' . gmdate( 'YmdHis' ) . '.csv"' );
	header( 'Pragma: no-cache' );
	header( 'Expires: 0' );
	echo "\xEF\xBB\xBF";

	$out = fopen( 'php://output', 'w' );

	// 🔒 CSV/数式インジェクション対策。mail_form側の lw_csv_neutralize_cell() をそのまま使う
	// （ロジックの二重管理を避ける。定義されていない＝mail_formサブシステムが無効な稀なケースのみ同等のフォールバックを使う）
	$neutralize = function_exists( 'lw_csv_neutralize_cell' )
		? 'lw_csv_neutralize_cell'
		: function ( $v ) {
			$v = (string) $v;
			return ( $v !== '' && preg_match( '/^[=+\-@\t\r]/', $v ) ) ? "'" . $v : $v;
		};

	fputcsv( $out, array_map( $neutralize, [ '日時', 'メールアドレス', '送信元ページ' ] ) );
	foreach ( $rows as $r ) {
		$body_arr = json_decode( $r->body, true ) ?: [];
		$email    = $body_arr['メールアドレス'] ?? '';
		fputcsv( $out, array_map( $neutralize, [
			mysql2date( 'Y-m-d H:i:s', $r->created_at ),
			$email,
			$r->post_id ? $r->post_title : '',
		] ) );
	}
	fclose( $out );
	exit;
} );
