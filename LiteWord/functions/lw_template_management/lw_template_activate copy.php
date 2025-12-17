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
 * 1) トークン保存処理
 * ======================================================= */
if ( $_SERVER['REQUEST_METHOD'] === 'POST'
	 && isset( $_POST['user_token'], $_POST['save_token'] ) ) {

	$token = sanitize_text_field( $_POST['user_token'] );
	update_user_meta( $current_user_id, 'lw_target_shop_token', $token );
	$saved_token = $token;
	$message     = '<div class="up_message"><p>トークンを保存しました。</p></div>';
}

/* =========================================================
 * 2) テンプレート取得＆保存処理（ドメイン自動登録対応）
 * ======================================================= */
if ( $_SERVER['REQUEST_METHOD'] === 'POST'
	 && isset( $_POST['user_token'], $_POST['fetch_templates'] ) ) {

	if ( ! current_user_can( 'administrator' ) ) wp_die( 'アクセス権限がありません。' );

	$token = sanitize_text_field( $_POST['user_token'] );
	
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
			$message = '<div class="up_message"><p>テンプレートデータの取得と保存に成功しました！</p></div>';
		} else {
			$message = '<div class="error_message"><p>アクティベートに失敗しました。トークンをご確認ください。</p></div>';
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
						<a href="https://shop.lite-word.com/user_login?redirect_url=https://shop.lite-word.com/template_activate" target="_blank" rel="noopener noreferrer" class="lw-link-btn lw-link-primary">
							<span class="dashicons dashicons-external"></span>
							LiteWord Studio を開く
						</a>
						<a href="https://www.youtube.com/watch?v=sYnHo9-Ax7Y" target="_blank" rel="noopener noreferrer" class="lw-link-btn lw-link-secondary">
							<span class="dashicons dashicons-video-alt3"></span>
							説明動画を見る
						</a>
					</div>
				</div>
			</div>

			<!-- ステップ2 -->
			<div class="lw-activate-step">
				<div class="lw-step-header">
					<span class="lw-step-badge">2</span>
					<h2 class="lw-step-title">トークンを入力・保存</h2>
				</div>
				<div class="lw-step-body">
					<p class="lw-step-desc">取得したアクセストークンを下に貼り付けて保存してください。</p>
					<form method="post" class="lw-token-form">
						<div class="lw-input-group">
							<label for="user_token" class="lw-input-label">
								<span class="dashicons dashicons-admin-network"></span>
								アクセストークン
							</label>
							<div class="lw-input-wrapper">
								<input type="password" name="user_token" id="user_token" value="<?php echo esc_attr( $saved_token ); ?>" placeholder="ここにトークンを貼り付け..." required>
								<button type="button" class="lw-toggle-password" title="表示/非表示">
									<span class="dashicons dashicons-visibility"></span>
								</button>
							</div>
						</div>
						<button type="submit" name="save_token" class="lw-btn lw-btn-primary">
							<span class="dashicons dashicons-yes-alt"></span>
							トークンを保存
						</button>
					</form>
					<?php if (!empty($saved_token)): ?>
					<div class="lw-token-status lw-status-saved">
						<span class="dashicons dashicons-yes"></span>
						トークンは保存済みです
					</div>
					<?php endif; ?>
				</div>
			</div>

			<!-- ステップ3 -->
			<div class="lw-activate-step lw-step-highlight">
				<div class="lw-step-header">
					<span class="lw-step-badge">3</span>
					<h2 class="lw-step-title">データを反映</h2>
				</div>
				<div class="lw-step-body">
					<p class="lw-step-desc">ボタンをクリックすると、LiteWord Studioと通信して購入済みテンプレートが反映されます。</p>
					<div class="lw-action-buttons">
						<form method="post" class="lw-fetch-form">
							<input type="hidden" name="user_token" value="<?php echo esc_attr( $saved_token ); ?>">
							<button type="submit" name="fetch_templates" class="lw-btn lw-btn-accent">
								<span class="dashicons dashicons-download"></span>
								テンプレートを取得して保存
							</button>
						</form>
						<form method="post" class="lw-reset-form" id="template_reset_form">
							<?php wp_nonce_field( 'lw_reset_templates_action', 'lw_reset_templates_nonce' ); ?>
							<input type="hidden" name="reset_templates" value="1">
							<button type="submit" class="lw-btn lw-btn-outline-danger">
								<span class="dashicons dashicons-trash"></span>
								リセット
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>

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
	text-decoration: none;
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

.lw-input-wrapper input[type="password"],
.lw-input-wrapper input[type="text"] {
	width: 100%;
	padding: 12px 48px 12px 16px;
	border: 2px solid #e5e7eb;
	border-radius: 10px;
	font-size: 14px;
	transition: all 0.2s ease;
	background: #f9fafb;
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
	// リセットフォーム確認
	const resetForm = document.getElementById('template_reset_form');
	if (resetForm) {
		resetForm.addEventListener('submit', e => {
			if ( ! confirm('購入したテンプレートデータをこのWordPressサイト内のみリセットします。本当によろしいですか？') ) {
				e.preventDefault();
			}
		});
	}

	// パスワード表示/非表示切替
	const toggleBtn = document.querySelector('.lw-toggle-password');
	const passwordInput = document.getElementById('user_token');
	if (toggleBtn && passwordInput) {
		toggleBtn.addEventListener('click', () => {
			const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
			passwordInput.setAttribute('type', type);
			const icon = toggleBtn.querySelector('.dashicons');
			if (icon) {
				icon.classList.toggle('dashicons-visibility');
				icon.classList.toggle('dashicons-hidden');
			}
		});
	}
});
</script>