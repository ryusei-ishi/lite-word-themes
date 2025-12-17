<?php
/**
 * LiteWord - アクティベート画面（テンプレート取得・保存）
 * ----------------------------------------------------------
 * ・ユーザーが入力したトークンで購入テンプレート一覧を取得
 * ・API が返す allowed_domain（カンマ区切り）と
 *   サイト URL を照合し、合わなければ active_flag=0
 * ・サブスクリプション契約時は sub_pre_set を追加
 */
if ( ! defined( 'ABSPATH' ) ) exit;

function lw_normalize_url_parts_2( $url ) {
	$url = trim( $url );
	if ( $url === '' ) return [ '', '/' ];

	if ( ! preg_match( '#^https?://#i', $url ) ) {
		$url = 'https://' . ltrim( $url, '/' );
	}
	$parts = wp_parse_url( trailingslashit( $url ) );
	$host  = strtolower( preg_replace( '/^www\./i', '', $parts['host'] ?? '' ) );
	$path  = strtolower( $parts['path'] ?? '/' );

	return [ $host, $path ];
}

/* =========================================================
 * 変数初期化
 * ======================================================= */
$current_user_id = get_current_user_id();
$saved_token     = get_user_meta( $current_user_id, 'lw_target_shop_token', true );
$message         = '';

// 接続状態をチェック（サブスクリプションまたは試用期間がアクティブか）
$is_connected = false;
if ( ! empty( $saved_token ) && defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true ) {
	$is_connected = true;
}

/* =========================================================
 * 0) リセット処理
 * ======================================================= */
if ( $_SERVER['REQUEST_METHOD'] === 'POST' && isset( $_POST['reset_templates'] ) ) {

	if ( ! current_user_can( 'administrator' ) ) wp_die( 'アクセス権限がありません。' );
	check_admin_referer( 'lw_reset_templates_action', 'lw_reset_templates_nonce' );

	global $wpdb;
	$wpdb->query( "TRUNCATE TABLE {$wpdb->prefix}lw_template_setting" );

	$message = '<div class="up_message"><p>テンプレートデータをリセットしました。</p></div>';
}

/* =========================================================
 * 0-2) トークン削除処理
 * ======================================================= */
if ( $_SERVER['REQUEST_METHOD'] === 'POST' && isset( $_POST['delete_token'] ) ) {

	if ( ! current_user_can( 'administrator' ) ) wp_die( 'アクセス権限がありません。' );
	check_admin_referer( 'lw_delete_token_action', 'lw_delete_token_nonce' );

	// 両方のトークンを削除
	delete_user_meta( $current_user_id, 'lw_target_shop_token' );
	delete_user_meta( $current_user_id, 'lw_shop_user_token' );
	$saved_token = '';

	$message = '<div class="up_message"><p>アクセストークンを削除しました。</p></div>';
}

/* =========================================================
 * 1) アクティベート処理（トークン保存 + API認証を同時実行）
 * ======================================================= */
$show_success_popup = false;

if ( $_SERVER['REQUEST_METHOD'] === 'POST'
	 && isset( $_POST['user_token'], $_POST['activate_token'] ) ) {

	if ( ! current_user_can( 'administrator' ) ) wp_die( 'アクセス権限がありません。' );

	$token = sanitize_text_field( $_POST['user_token'] );

	// トークンが空の場合はエラー
	if ( empty( $token ) ) {
		$message = '<div class="error_message"><p>アクセストークンを入力してください。</p></div>';
	} else {
		// トークンを保存（ログイン時の自動認証で使用するため）
		update_user_meta( $current_user_id, 'lw_target_shop_token', $token );
		$saved_token = $token;

		// 現在のサイトドメインを取得
		$current_domain = wp_parse_url( home_url(), PHP_URL_HOST );

		$shop_url = "https://shop.lite-word.com";// 本番用
		$shop_test_url = "http://localhost/SUPPORT_LOUNGE/LiteWord_SHOP"; // テスト用

		// APIリクエストにドメインパラメータを追加
		$api = $shop_url . '/wp-json/liteword/v1/secure-purchase-history?token=' .
		       urlencode( $token ) . '&domain=' . urlencode( $current_domain );

		$response = wp_remote_get( $api );

		if ( is_wp_error( $response ) ) {
			$message = '<div class="error_message"><p>API通信エラー：' .
			           esc_html( $response->get_error_message() ) . '</p></div>';

		} else {

			$data = json_decode( wp_remote_retrieve_body( $response ), true );

			// 共通関数を使用してデータ処理
			if ( lw_process_api_data_to_templates( $data ) ) {
				$show_success_popup = true;
			} else {
				$message = '<div class="error_message"><p>アクティベートに失敗しました。トークンをご確認ください。</p></div>';
			}
		}
	}
}
?>
<!-- =========================================================
     管理画面 UI
========================================================= -->
<div class="lw-activate-page none_plugin_message">
	<div class="lw-activate-container">
		<!-- ヘッダー -->
		<div class="lw-activate-header">
			<div class="lw-activate-icon">
				<span class="dashicons dashicons-admin-network"></span>
			</div>
			<h1 class="lw-activate-title">LiteWord アクティベート</h1>
			<p class="lw-activate-subtitle">LiteWord Studioと連携して、購入済みテンプレートを有効化します</p>
		</div>

		<?php if ( $is_connected ): ?>
		<div class="lw-connected-banner">
			<div class="lw-connected-icon">
				<span class="dashicons dashicons-yes-alt"></span>
			</div>
			<div class="lw-connected-text">
				<strong>LiteWord Studioとの接続が完了しています</strong>
				<span>購入済みテンプレートは有効になっています</span>
			</div>
		</div>
		<?php endif; ?>

		<?php if ($message): ?>
		<div class="lw-activate-message-area">
			<?php echo $message; ?>
		</div>
		<?php endif; ?>

		<!-- ステップカード -->
		<div class="lw-activate-steps">
			<!-- ステップ1 -->
			<div class="lw-activate-step">
				<div class="lw-step-header">
					<span class="lw-step-badge">1</span>
					<h2 class="lw-step-title">アクセストークンを取得</h2>
				</div>
				<div class="lw-step-body">
					<p class="lw-step-desc">LiteWord Studioにログインして、あなた専用のアクセストークンを取得してください。</p>
					<div class="lw-step-links">
						<button type="button" class="lw-link-btn lw-link-primary" id="lw-activate-login-btn" data-lw-shop-action="login" data-lw-activate-page="true">
							<span class="dashicons dashicons-admin-network"></span>
							LiteWord Studio にログイン
						</button>
					</div>
				</div>
			</div>

			<!-- ステップ2（統合版） -->
			<div class="lw-activate-step lw-step-highlight">
				<div class="lw-step-header">
					<span class="lw-step-badge">2</span>
					<h2 class="lw-step-title">トークンを入力してアクティベート</h2>
				</div>
				<div class="lw-step-body">
					<p class="lw-step-desc">取得したアクセストークンを入力して、アクティベートボタンを押してください。</p>
					<form method="post" class="lw-token-form" autocomplete="off">
						<input type="hidden" name="activate_token" value="1">
						<div class="lw-input-group">
							<label for="user_token" class="lw-input-label">
								<span class="dashicons dashicons-admin-network"></span>
								アクセストークン
							</label>
							<div class="lw-input-wrapper">
								<input type="text" name="user_token" id="user_token" class="lw-token-input" value="<?php echo esc_attr( $saved_token ); ?>" placeholder="ここにトークンを貼り付け..." autocomplete="off" required>
								<button type="button" class="lw-toggle-password" title="表示/非表示">
									<span class="dashicons dashicons-hidden"></span>
								</button>
							</div>
						</div>
						<div class="lw-action-buttons">
							<button type="submit" class="lw-btn lw-btn-accent">
								<span class="dashicons dashicons-yes-alt"></span>
								アクティベート
							</button>
							<button type="button" class="lw-btn lw-btn-outline-secondary" id="reset_btn">
								<span class="dashicons dashicons-update"></span>
								リセット
							</button>
							<button type="button" class="lw-btn lw-btn-outline-danger" id="delete_token_btn">
								<span class="dashicons dashicons-trash"></span>
								削除
							</button>
						</div>
					</form>
					<?php if (!empty($saved_token)): ?>
					<div class="lw-token-status lw-status-saved">
						<span class="dashicons dashicons-yes"></span>
						トークンは保存済みです
					</div>
					<?php endif; ?>
				</div>
			</div>
		</div>

		<!-- リセット用の非表示フォーム -->
		<form method="post" id="template_reset_form" style="display:none;">
			<?php wp_nonce_field( 'lw_reset_templates_action', 'lw_reset_templates_nonce' ); ?>
			<input type="hidden" name="reset_templates" value="1">
		</form>

		<!-- トークン削除用の非表示フォーム -->
		<form method="post" id="delete_token_form" style="display:none;">
			<?php wp_nonce_field( 'lw_delete_token_action', 'lw_delete_token_nonce' ); ?>
			<input type="hidden" name="delete_token" value="1">
		</form>

	</div>
</div>

<?php if ( $show_success_popup ): ?>
<!-- 完了ポップアップ -->
<div class="lw-success-overlay" id="lw-success-popup">
	<div class="lw-success-popup">
		<div class="lw-success-icon">
			<span class="dashicons dashicons-yes-alt"></span>
		</div>
		<h2 class="lw-success-title">アクティベート完了</h2>
		<p class="lw-success-message">LiteWord Studioとの連携が完了しました。</p>
		<a href="<?php echo admin_url( 'index.php' ); ?>" class="lw-btn lw-btn-accent lw-btn-block">
			<span class="dashicons dashicons-admin-home"></span>
			ダッシュボードに戻る
		</a>
	</div>
</div>

<style>
.lw-success-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	z-index: 999999;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: lw-fade-in 0.3s ease;
}

@keyframes lw-fade-in {
	from { opacity: 0; }
	to { opacity: 1; }
}

.lw-success-popup {
	background: #fff;
	border-radius: 16px;
	padding: 40px;
	text-align: center;
	max-width: 400px;
	width: 90%;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	animation: lw-popup-slide-in 0.4s ease;
}

@keyframes lw-popup-slide-in {
	from {
		opacity: 0;
		transform: scale(0.9) translateY(-20px);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
}

.lw-success-icon {
	width: 80px;
	height: 80px;
	background: linear-gradient(135deg, #10b981, #059669);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 20px;
	box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
}

.lw-success-icon .dashicons {
	font-size: 40px;
	width: 40px;
	height: 40px;
	color: #fff;
}

.lw-success-title {
	font-size: 24px;
	font-weight: 700;
	color: #1f2937;
	margin: 0 0 15px;
}

.lw-success-message {
	font-size: 14px;
	color: #6b7280;
	line-height: 1.6;
	margin: 0 0 25px;
}

.lw-success-popup .lw-btn-block {
	width: 100%;
	justify-content: center;
	text-decoration: none !important;
	box-sizing: border-box;
}
</style>
<?php endif; ?>

<style>
/* WordPress管理画面リセット */
#wpbody-content { padding-bottom: 0; }
#wpcontent { padding-left: 0; }
#wpfooter { display: none; }

/* ページ全体 */
.lw-activate-page {
	min-height: 100vh;
	padding: 40px 20px 80px;
	background: linear-gradient(45deg, #7e3be3, #2b72b5, #44ea76);
	background-size: 200% 200%;
	animation: lw-gradient-shift 20s ease infinite;
}

@keyframes lw-gradient-shift {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}

/* コンテナ */
.lw-activate-container {
	max-width: 680px;
	margin: 0 auto;
}

/* ヘッダー */
.lw-activate-header {
	text-align: center;
	margin-bottom: 32px;
	color: #fff;
}

.lw-activate-icon {
	width: 80px;
	height: 80px;
	margin: 0 auto 20px;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10px);
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.lw-activate-icon .dashicons {
	font-size: 40px;
	width: 40px;
	height: 40px;
	color: #fff;
}

.lw-activate-title {
	font-size: 28px;
	font-weight: 700;
	margin: 0 0 8px;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	color: #fff;
}

.lw-activate-subtitle {
	font-size: 15px;
	opacity: 0.9;
	margin: 0;
}

/* 接続済みバナー */
.lw-connected-banner {
	display: flex;
	align-items: center;
	gap: 15px;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	border-radius: 12px;
	padding: 16px 20px;
	margin-bottom: 20px;
	border-left: 4px solid #10b981;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.lw-connected-icon {
	width: 44px;
	height: 44px;
	background: linear-gradient(135deg, #10b981, #059669);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.lw-connected-icon .dashicons {
	font-size: 24px;
	width: 24px;
	height: 24px;
	color: #fff;
}

.lw-connected-text {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.lw-connected-text strong {
	font-size: 15px;
	color: #065f46;
}

.lw-connected-text span {
	font-size: 13px;
	color: #6b7280;
}

/* メッセージエリア */
.lw-activate-message-area {
	margin-bottom: 24px;
}

.up_message {
	background: linear-gradient(135deg, #d4edda, #c3e6cb);
	border: none;
	border-left: 4px solid #28a745;
	color: #155724;
	padding: 16px 20px;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
}

.up_message p { margin: 0; font-weight: 500; }

.error_message {
	background: linear-gradient(135deg, #f8d7da, #f5c6cb);
	border: none;
	border-left: 4px solid #dc3545;
	color: #721c24;
	padding: 16px 20px;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);
}

.error_message p { margin: 0; font-weight: 500; }

/* ステップカード群 */
.lw-activate-steps {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

/* 各ステップカード */
.lw-activate-step {
	background: #fff;
	border-radius: 16px;
	padding: 24px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.lw-activate-step::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 4px;
	background: linear-gradient(180deg, #2b72b5, #44ea76);
	opacity: 0;
	transition: opacity 0.3s ease;
}

.lw-activate-step:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.lw-activate-step:hover::before {
	opacity: 1;
}

.lw-step-highlight {
	background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
}

.lw-step-highlight::before {
	opacity: 1;
	background: linear-gradient(180deg, #2b72b5, #44ea76);
}

/* ステップヘッダー */
.lw-step-header {
	display: flex;
	align-items: center;
	gap: 14px;
	margin-bottom: 16px;
}

.lw-step-badge {
	width: 32px;
	height: 32px;
	background: linear-gradient(135deg, #2b72b5, #3d8fd1);
	color: #fff;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	font-size: 15px;
	flex-shrink: 0;
	box-shadow: 0 4px 12px rgba(43, 114, 181, 0.3);
}

.lw-step-title {
	font-size: 17px;
	font-weight: 600;
	color: #1f2937;
	margin: 0;
}

/* ステップ本文 */
.lw-step-body {
	padding-left: 46px;
}

.lw-step-desc {
	color: #6b7280;
	font-size: 14px;
	line-height: 1.6;
	margin: 0 0 16px;
}

/* リンクボタン */
.lw-step-links {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.lw-link-btn {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 10px 18px;
	border-radius: 10px;
	font-size: 14px;
	font-weight: 500;
	text-decoration: none !important;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;
}

.lw-link-btn .dashicons {
	font-size: 16px;
	width: 16px;
	height: 16px;
}

.lw-link-primary {
	background: linear-gradient(135deg, #2b72b5, #3d8fd1);
	color: #fff;
	box-shadow: 0 4px 15px rgba(43, 114, 181, 0.3);
	text-decoration: none;
}

.lw-link-primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(43, 114, 181, 0.4);
	color: #fff;
}

.lw-link-secondary {
	background: #f3f4f6;
	color: #4b5563;
}

.lw-link-secondary:hover {
	background: #e5e7eb;
	color: #374151;
}

/* トークンフォーム */
.lw-token-form {
	margin-bottom: 12px;
}

.lw-input-group {
	margin-bottom: 14px;
}

.lw-input-label {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 13px;
	font-weight: 600;
	color: #374151;
	margin-bottom: 8px;
}

.lw-input-label .dashicons {
	font-size: 16px;
	width: 16px;
	height: 16px;
	color: #2b72b5;
}

.lw-input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.lw-input-wrapper input[type="text"] {
	width: 100%;
	padding: 12px 48px 12px 16px;
	border: 2px solid #e5e7eb;
	border-radius: 10px;
	font-size: 14px;
	transition: all 0.2s ease;
	background: #f9fafb;
}

/* トークン入力欄のマスク表示 */
.lw-token-input {
	-webkit-text-security: disc;
	text-security: disc;
}

.lw-token-input.is-visible {
	-webkit-text-security: none;
	text-security: none;
}

.lw-input-wrapper input:focus {
	outline: none;
	border-color: #2b72b5;
	background: #fff;
	box-shadow: 0 0 0 3px rgba(43, 114, 181, 0.1);
}

.lw-toggle-password {
	position: absolute;
	right: 12px;
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	color: #9ca3af;
	transition: color 0.2s ease;
}

.lw-toggle-password:hover {
	color: #2b72b5;
}

.lw-toggle-password .dashicons {
	font-size: 20px;
	width: 20px;
	height: 20px;
}

/* トークンステータス */
.lw-token-status {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 13px;
	padding: 8px 12px;
	border-radius: 8px;
	margin-top: 8px;
}

.lw-status-saved {
	background: #d1fae5;
	color: #065f46;
}

.lw-status-saved .dashicons {
	font-size: 16px;
	width: 16px;
	height: 16px;
}

/* ボタン */
.lw-btn {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 12px 24px;
	border: none;
	border-radius: 10px;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
}

.lw-btn .dashicons {
	font-size: 18px;
	width: 18px;
	height: 18px;
}

.lw-btn-primary {
	background: linear-gradient(135deg, #2b72b5, #3d8fd1);
	color: #fff;
	box-shadow: 0 4px 15px rgba(43, 114, 181, 0.3);
}

.lw-btn-primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(43, 114, 181, 0.4);
}

.lw-btn-accent {
	background: linear-gradient(135deg, #10b981, #059669);
	color: #fff;
	box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.lw-btn-accent:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.lw-btn-outline-secondary {
	background: #fff;
	color: #6b7280;
	border: 2px solid #e5e7eb;
}

.lw-btn-outline-secondary:hover {
	background: #f3f4f6;
	border-color: #9ca3af;
}

.lw-btn-outline-danger {
	background: #fff;
	color: #ef4444;
	border: 2px solid #fecaca;
}

.lw-btn-outline-danger:hover {
	background: #fef2f2;
	border-color: #ef4444;
}

/* アクションボタン群 */
.lw-action-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	align-items: center;
}

.lw-fetch-form,
.lw-reset-form {
	display: inline-block;
}

/* フッター */
.lw-activate-footer {
	text-align: center;
	margin-top: 32px;
	color: rgba(255, 255, 255, 0.8);
	font-size: 13px;
}

.lw-activate-footer a {
	color: #fff;
	text-decoration: underline;
}

.lw-activate-footer a:hover {
	text-decoration: none;
}

/* レスポンシブ */
@media (max-width: 600px) {
	.lw-activate-page {
		padding: 24px 16px 60px;
	}

	.lw-activate-step {
		padding: 20px 16px;
	}

	.lw-step-body {
		padding-left: 0;
	}

	.lw-step-links,
	.lw-action-buttons {
		flex-direction: column;
	}

	.lw-link-btn,
	.lw-btn {
		width: 100%;
		justify-content: center;
	}
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
	// リセットボタンのクリックイベント
	const resetBtn = document.getElementById('reset_btn');
	const resetForm = document.getElementById('template_reset_form');
	if (resetBtn && resetForm) {
		resetBtn.addEventListener('click', () => {
			if ( confirm('購入したテンプレートデータをこのWordPressサイト内のみリセットします。本当によろしいですか？') ) {
				resetForm.submit();
			}
		});
	}

	// 削除ボタンのクリックイベント
	const deleteTokenBtn = document.getElementById('delete_token_btn');
	const deleteTokenForm = document.getElementById('delete_token_form');
	if (deleteTokenBtn && deleteTokenForm) {
		deleteTokenBtn.addEventListener('click', () => {
			if ( confirm('アクセストークンを削除します。本当によろしいですか？') ) {
				deleteTokenForm.submit();
			}
		});
	}

	// トークン表示/非表示切替
	const toggleBtn = document.querySelector('.lw-toggle-password');
	const tokenInput = document.getElementById('user_token');
	if (toggleBtn && tokenInput) {
		toggleBtn.addEventListener('click', () => {
			tokenInput.classList.toggle('is-visible');
			const icon = toggleBtn.querySelector('.dashicons');
			if (icon) {
				icon.classList.toggle('dashicons-visibility');
				icon.classList.toggle('dashicons-hidden');
			}
		});
	}

	// ログイン成功時にトークンを自動入力してアクティベート
	document.addEventListener('lw-activate-login-success', (e) => {
		const accessToken = e.detail.accessToken;
		if (!accessToken || !tokenInput) return;

		const existingToken = tokenInput.value.trim();

		if (existingToken) {
			// 既存のトークンがある場合は確認
			if (confirm('既にアクセストークンが設定されています。\n上書きしてもよろしいですか？')) {
				tokenInput.value = accessToken;
				document.querySelector('.lw-token-form').submit();
			}
		} else {
			// 既存のトークンがない場合はそのまま処理
			tokenInput.value = accessToken;
			document.querySelector('.lw-token-form').submit();
		}
	});
});
</script>