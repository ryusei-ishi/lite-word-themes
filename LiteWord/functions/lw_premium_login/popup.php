<?php
if ( !defined( 'ABSPATH' ) ) exit;

/**
 * LiteWord ショップログイン ポップアップ機能
 *
 * 使い方:
 * <a href="https://shop.lite-word.com/account/" data-lw-shop-action="login">マイページ</a>
 * <button data-lw-shop-action="login" data-redirect="/purchase-history/">購入履歴</button>
 */

/**
 * AJAX: トークンをユーザーメタに保存
 */
add_action( 'wp_ajax_lw_save_shop_token', 'lw_save_shop_token_callback' );

function lw_save_shop_token_callback() {
	// nonceチェック
	if ( ! check_ajax_referer( 'lw_save_shop_token', 'nonce', false ) ) {
		wp_send_json_error( array( 'message' => '不正なリクエスト' ) );
	}

	$token = sanitize_text_field( $_POST['token'] ?? '' );
	if ( empty( $token ) ) {
		wp_send_json_error( array( 'message' => 'トークンがありません' ) );
	}

	$user_id = get_current_user_id();
	if ( ! $user_id ) {
		wp_send_json_error( array( 'message' => 'ログインしていません' ) );
	}

	update_user_meta( $user_id, 'lw_shop_user_token', $token );

	wp_send_json_success( array( 'message' => '保存しました' ) );
}

/**
 * 管理画面フッターにポップアップHTMLを出力
 */
add_action( 'admin_footer', 'lw_shop_login_popup_html' );

function lw_shop_login_popup_html() {
	$shop_url = get_option( 'lw_shop_url', 'https://shop.lite-word.com' );
	$shop_url_production = 'https://shop.lite-word.com'; // ログイン/登録リンクは常に本番
	$access_token = get_user_meta( get_current_user_id(), 'lw_shop_user_token', true );
	$has_token = ! empty( $access_token );
	?>
	<!-- LiteWord ショップログインポップアップ -->
	<div class="lw-modal-overlay lw-wizard-modal" id="lw-shop-login-modal">
		<div class="lw-wizard-popup lw-wizard-popup-sm">
			<div class="lw-wizard-popup-header">
				<h3>
					<span class="dashicons dashicons-store"></span>
					LiteWord Studio
					<a href="#" class="lw-shop-help-link" id="lw-shop-help-toggle">
						<span class="dashicons dashicons-editor-help"></span>
					</a>
				</h3>
				<button type="button" class="lw-modal-close" data-modal="lw-shop-login-modal">
					<span class="dashicons dashicons-no-alt"></span>
				</button>
			</div>
			<!-- LiteWord Studio説明 -->
			<div class="lw-shop-help-box" id="lw-shop-help-box" style="display: none;">
				<p><strong>LiteWord Studio とは？</strong></p>
				<p>LiteWordをご利用いただいているユーザー様の情報を管理しているサイトです。</p>
				<p id="lw-shop-user-info-text" style="display: none;"></p>
				<ul>
					<li>プレミアムプランへの変更・解約</li>
					<li>ご登録情報の確認・変更</li>
					<li>ご利用履歴の確認</li>
				</ul>
				<p class="lw-shop-help-note">※ LiteWord Studio へのログインには認証が必要です</p>
			</div>
			<div class="lw-wizard-popup-body">
				<?php if ( ! $has_token ): ?>
				<!-- トークンがない場合：ログインフォームを表示 -->
				<div id="lw-shop-no-token">
					<p class="lw-shop-login-lead">LiteWord Studio にログインしてください</p>
					<p style="text-align: center; color: #666; font-size: 14px; margin-bottom: 20px;">
						アカウントをお持ちでない場合は<a href="<?php echo esc_url( $shop_url_production ); ?>/user_login" target="_blank" style="color: #667eea;">新規登録</a>してください
					</p>
					<form class="lw-shop-login-form" onsubmit="return false;" autocomplete="off">
						<div class="lw-form-field">
							<label>メールアドレスまたはユーザー名</label>
							<input type="text" id="lw-shop-new-login-id" placeholder="登録したメールアドレス">
						</div>
						<div class="lw-form-field">
							<label>パスワード</label>
							<input type="password" id="lw-shop-new-login-password" placeholder="パスワード">
						</div>
						<p class="lw-shop-forgot-password">
							<a href="<?php echo esc_url( $shop_url_production ); ?>/password_reset" target="_blank">パスワードをお忘れですか？</a>
						</p>
						<div id="lw-shop-new-login-error" class="lw-shop-login-error" style="display: none;"></div>
						<button type="button" class="lw-btn lw-btn-primary lw-btn-block" id="lw-shop-new-login-btn">
							<span class="dashicons dashicons-yes"></span>
							ログインして接続
						</button>
					</form>
					<!-- ログイン成功後に表示 -->
					<div id="lw-shop-new-login-success" style="display: none;">
						<div class="lw-shop-login-success">
							<span class="dashicons dashicons-yes-alt"></span>
							接続が完了しました
						</div>
						<p style="text-align: center; color: #666; font-size: 13px; margin: 15px 0 5px;">どちらにアクセスしますか？</p>
						<div class="lw-shop-btn-group">
							<a href="#" id="lw-shop-upgrade-btn" class="lw-btn lw-btn-primary lw-btn-block lw-shop-close-on-click" target="_blank">
								<span class="dashicons dashicons-star-filled"></span>
								プレミアムプランにアップグレード
							</a>
							<a href="#" id="lw-shop-account-btn" class="lw-btn lw-btn-secondary lw-btn-block lw-shop-close-on-click" target="_blank">
								<span class="dashicons dashicons-admin-users"></span>
								アカウント情報の確認
							</a>
						</div>
						<p style="text-align: center; color: #666; font-size: 12px; margin-top: 10px;">
							次回からはワンクリックでアクセスできます
						</p>
					</div>
				</div>
				<?php else: ?>
				<!-- 状態表示エリア -->
				<div id="lw-shop-login-status" style="display: none;">
					<div class="lw-shop-login-checking">
						<span class="spinner is-active" style="float: none; margin: 0 10px 0 0;"></span>
						<span>認証状態を確認中...</span>
					</div>
				</div>

				<!-- 認証が必要な場合（ドメイン未認証） -->
				<div id="lw-shop-login-auth-required" style="display: none;">
					<p class="lw-shop-login-lead" id="lw-shop-auth-lead-text">このドメインからの初回アクセスです。<br>本人確認のため、認証が必要です。</p>

					<form class="lw-shop-login-form" onsubmit="return false;" autocomplete="off">
						<div class="lw-form-field">
							<label>メールアドレスまたはユーザー名</label>
							<input type="text" id="lw-shop-login-id" placeholder="登録したメールアドレス">
						</div>
						<div class="lw-form-field">
							<label>パスワード</label>
							<input type="password" id="lw-shop-login-password" placeholder="パスワード" autocomplete="off">
						</div>
						<p class="lw-shop-forgot-password">
							<a href="<?php echo esc_url( $shop_url_production ); ?>/password_reset" target="_blank">パスワードをお忘れですか？</a>
						</p>
						<div id="lw-shop-login-error" class="lw-shop-login-error" style="display: none;"></div>
						<button type="button" class="lw-btn lw-btn-primary lw-btn-block" id="lw-shop-password-btn">
							<span class="dashicons dashicons-yes"></span>
							認証してアクセス
						</button>
					</form>
				</div>

				<!-- 認証完了後のボタン（認証済み or パスワード認証成功後に表示） -->
				<div id="lw-shop-login-verified" style="display: none;">
					<div class="lw-shop-login-success">
						<span class="dashicons dashicons-yes-alt"></span>
						LiteWord Studio に接続済みです
					</div>
					<p style="text-align: center; color: #666; font-size: 13px; margin: 15px 0 5px;">どちらにアクセスしますか？</p>
					<div class="lw-shop-btn-group">
						<a href="#" id="lw-shop-go-upgrade-btn" class="lw-btn lw-btn-primary lw-btn-block lw-shop-close-on-click" target="_blank">
							<span class="dashicons dashicons-star-filled"></span>
							プレミアムプランにアップグレード
						</a>
						<a href="#" id="lw-shop-go-account-btn" class="lw-btn lw-btn-secondary lw-btn-block lw-shop-close-on-click" target="_blank">
							<span class="dashicons dashicons-admin-users"></span>
							アカウント情報の確認
						</a>
					</div>
				</div>

				<!-- トークン無効時（設定が必要） -->
				<div id="lw-shop-token-required" style="display: none;">
					<div class="lw-shop-token-required-icon">
						<span class="dashicons dashicons-warning"></span>
					</div>
					<p class="lw-shop-login-lead">アクセストークンの設定が必要です。</p>
					<p style="text-align: center; color: #666; font-size: 13px; margin-bottom: 20px;">
						下のフォームからLiteWord Studioにログインしてください。
					</p>
					<button type="button" class="lw-btn lw-btn-primary lw-btn-block" id="lw-shop-token-required-close">
						<span class="dashicons dashicons-yes"></span>
						閉じる
					</button>
				</div>
				<?php endif; ?>
			</div>
		</div>
	</div>

	<style>
	/* モーダル基本スタイル（dashboard-common.cssが読み込まれていない場合用） */
	.lw-wizard-modal {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 999999;
		align-items: center;
		justify-content: center;
	}
	.lw-wizard-modal.active {
		display: flex;
	}
	.lw-wizard-popup {
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		width: 480px;
		max-width: 90vw;
		max-height: 90vh;
		overflow: hidden;
		animation: lw-popup-appear 0.3s ease;
	}
	.lw-wizard-popup-sm {
		width: 480px;
	}
	.lw-wizard-popup-sm * {
		box-sizing: border-box;
	}
	@keyframes lw-popup-appear {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
	.lw-wizard-popup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 25px;
		background: linear-gradient(135deg, #5a67d8 0%, #667eea 50%, #764ba2 100%);
		border-radius: 12px 12px 0 0;
	}
	.lw-wizard-popup-header h3 {
		color: #fff;
		font-size: 18px;
		font-weight: 600;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.lw-wizard-popup-header h3 .dashicons {
		font-size: 20px;
		width: 20px;
		height: 20px;
	}
	.lw-modal-close {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 6px;
		width: 32px;
		height: 32px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}
	.lw-modal-close:hover {
		background: rgba(255, 255, 255, 0.3);
	}
	.lw-modal-close .dashicons {
		color: #fff;
		font-size: 20px;
		width: 20px;
		height: 20px;
	}
	.lw-wizard-popup-body {
		padding: 25px;
		overflow-y: auto;
		flex: 1;
	}

	/* ショップログインポップアップ専用スタイル */
	#lw-shop-login-modal .lw-wizard-popup-body {
		padding: 25px;
	}
	/* ヘルプリンク */
	.lw-shop-help-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		margin-left: 5px;
		color: #999;
		text-decoration: none;
		vertical-align: middle;
	}
	.lw-shop-help-link:hover {
		color: #667eea;
	}
	.lw-shop-help-link .dashicons {
		font-size: 18px;
		width: 18px;
		height: 18px;
	}
	/* ヘルプボックス */
	.lw-shop-help-box {
		background: #f0f4ff;
		border-left: 4px solid #667eea;
		padding: 15px 20px;
		margin: 0;
		font-size: 13px;
		line-height: 1.6;
	}
	.lw-shop-help-box p {
		margin: 0 0 10px;
	}
	.lw-shop-help-box p:last-child {
		margin-bottom: 0;
	}
	.lw-shop-help-box ul {
		margin: 10px 0;
		padding-left: 20px;
		list-style: disc;
	}
	.lw-shop-help-box li {
		margin-bottom: 5px;
		list-style: disc;
		display: list-item;
	}
	.lw-shop-help-note {
		color: #666;
		font-size: 12px;
	}
	.lw-shop-login-lead {
		text-align: center;
		color: #666;
		margin-bottom: 25px;
		line-height: 1.6;
	}
	.lw-shop-login-form {
		text-align: left;
	}
	.lw-shop-forgot-password {
		text-align: right;
		margin: -5px 0 15px;
		font-size: 12px;
	}
	.lw-shop-forgot-password a {
		color: #667eea;
		text-decoration: none;
	}
	.lw-shop-forgot-password a:hover {
		text-decoration: underline;
	}
	.lw-form-field {
		margin-bottom: 15px;
	}
	.lw-form-field label {
		display: block;
		font-size: 12px;
		font-weight: 600;
		color: #555;
		margin-bottom: 5px;
	}
	.lw-form-field input {
		width: 100%;
		padding: 10px 12px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 14px;
		transition: border-color 0.2s;
	}
	.lw-form-field input:focus {
		outline: none;
		border-color: var(--lw-primary-light, #667eea);
	}
	.lw-shop-login-error {
		background: #fee2e2;
		color: #b91c1c;
		padding: 10px 15px;
		border-radius: 8px;
		font-size: 13px;
		margin-bottom: 15px;
	}
	.lw-shop-login-success {
		background: #d1fae5;
		color: #065f46;
		padding: 15px;
		border-radius: 8px;
		font-size: 14px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.lw-shop-login-success .dashicons {
		font-size: 20px;
		width: 20px;
		height: 20px;
	}
	.lw-shop-token-required-icon {
		width: 60px;
		height: 60px;
		background: linear-gradient(135deg, #fef3c7, #fde68a);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 20px;
	}
	.lw-shop-token-required-icon .dashicons {
		font-size: 28px;
		width: 28px;
		height: 28px;
		color: #d97706;
	}
	.lw-shop-btn-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 15px;
	}
	.lw-shop-btn-group .lw-btn {
		text-decoration: none;
	}
	.lw-shop-login-checking {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30px;
		color: #666;
	}
	/* ボタンスタイル */
	#lw-shop-login-modal .lw-btn,
	#lw-shop-login-modal .lw-btn *,
	#lw-shop-login-modal a.lw-btn,
	#lw-shop-login-modal a.lw-btn:hover,
	#lw-shop-login-modal a.lw-btn:focus,
	#lw-shop-login-modal a.lw-btn:visited {
		text-decoration: none !important;
	}
	#lw-shop-login-modal .lw-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 20px;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	#lw-shop-login-modal .lw-btn-block {
		width: 100%;
		text-decoration: none !important;
	}
	#lw-shop-login-modal .lw-btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
	}
	#lw-shop-login-modal .lw-btn-primary:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
	}
	#lw-shop-login-modal .lw-btn-secondary {
		background: #f3f4f6;
		color: #374151;
		border: 2px solid #e5e7eb;
	}
	#lw-shop-login-modal .lw-btn-secondary:hover {
		background: #e5e7eb;
	}
	#lw-shop-login-modal .lw-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none !important;
	}
	#lw-shop-login-modal .lw-btn .dashicons {
		font-size: 18px;
		width: 18px;
		height: 18px;
	}
	</style>

	<script>
	(function() {
		'use strict';

		// ポップアップからのAPI通信は常に本番URLを使用（localhostユーザーも利用可能にするため）
		var shopUrl = <?php echo json_encode( $shop_url_production ); ?>;
		var accessToken = <?php echo json_encode( $access_token ); ?>;
		var hasToken = <?php echo $has_token ? 'true' : 'false'; ?>;
		var siteUrl = <?php echo json_encode( home_url() ); ?>;
		var currentRedirect = '';
		var currentCustomText = '';
		var defaultAuthText = 'このドメインからの初回アクセスです。<br>本人確認のため、認証が必要です。';
		var ajaxUrl = <?php echo json_encode( admin_url( 'admin-ajax.php' ) ); ?>;
		var saveTokenNonce = <?php echo json_encode( wp_create_nonce( 'lw_save_shop_token' ) ); ?>;
		var isTokenInvalid = false; // トークンが無効な場合のフラグ
		var isFromActivatePage = false; // アクティベートページからのログインかどうか

		// DOM要素
		var modal, statusArea, authRequired, verifiedArea, tokenRequiredArea, errorArea;
		var passwordBtn;
		var loginIdInput, passwordInput;

		// モーダル表示/非表示関数（DOMContentLoadedの外で定義）
		function showModal() {
			if (!modal) return;
			document.querySelectorAll('.lw-modal-overlay.active, .lw-wizard-modal.active').forEach(function(otherModal) {
				if (otherModal !== modal) {
					otherModal.classList.remove('active');
				}
			});
			document.querySelectorAll('.lw-trial-overlay, .lw-warning-overlay, .lw-expired-overlay').forEach(function(trialPopup) {
				trialPopup.style.display = 'none';
			});
			modal.classList.add('active');
		}

		function closeModal() {
			if (!modal) return;
			modal.classList.remove('active');
			resetModal();
		}

		function resetModal() {
			if (statusArea) statusArea.style.display = 'none';
			if (authRequired) authRequired.style.display = 'none';
			if (verifiedArea) verifiedArea.style.display = 'none';
			if (tokenRequiredArea) tokenRequiredArea.style.display = 'none';
			if (errorArea) errorArea.style.display = 'none';
			if (loginIdInput) loginIdInput.value = '';
			if (passwordInput) passwordInput.value = '';
			if (passwordBtn) {
				passwordBtn.disabled = false;
				passwordBtn.innerHTML = '<span class="dashicons dashicons-yes"></span> 認証してアクセス';
			}
			var goUpgradeBtn = document.getElementById('lw-shop-go-upgrade-btn');
			var goAccountBtn = document.getElementById('lw-shop-go-account-btn');
			if (goUpgradeBtn) goUpgradeBtn.href = '#';
			if (goAccountBtn) goAccountBtn.href = '#';
			var leadText = document.getElementById('lw-shop-auth-lead-text');
			if (leadText) leadText.innerHTML = defaultAuthText;
			currentCustomText = '';
			isTokenInvalid = false;
			isFromActivatePage = false;
			var helpBox = document.getElementById('lw-shop-help-box');
			if (helpBox) helpBox.style.display = 'none';
			// トークンなしの場合のフォームもリセット
			var newLoginId = document.getElementById('lw-shop-new-login-id');
			var newLoginPassword = document.getElementById('lw-shop-new-login-password');
			var newLoginError = document.getElementById('lw-shop-new-login-error');
			var newLoginBtn = document.getElementById('lw-shop-new-login-btn');
			if (newLoginId) newLoginId.value = '';
			if (newLoginPassword) newLoginPassword.value = '';
			if (newLoginError) newLoginError.style.display = 'none';
			if (newLoginBtn) {
				newLoginBtn.disabled = false;
				newLoginBtn.innerHTML = '<span class="dashicons dashicons-yes"></span> ログインして接続';
			}
		}

		document.addEventListener('DOMContentLoaded', function() {
			modal = document.getElementById('lw-shop-login-modal');
			if (!modal) return;

			statusArea = document.getElementById('lw-shop-login-status');
			authRequired = document.getElementById('lw-shop-login-auth-required');
			verifiedArea = document.getElementById('lw-shop-login-verified');
			tokenRequiredArea = document.getElementById('lw-shop-token-required');
			errorArea = document.getElementById('lw-shop-login-error');
			passwordBtn = document.getElementById('lw-shop-password-btn');
			loginIdInput = document.getElementById('lw-shop-login-id');
			passwordInput = document.getElementById('lw-shop-login-password');

			// イベント委譲: 動的に追加される要素にも対応
			document.body.addEventListener('click', function(e) {
				// data-lw-shop-action="login" を持つ要素
				var target = e.target.closest('[data-lw-shop-action="login"]');
				if (target) {
					e.preventDefault();
					currentRedirect = target.getAttribute('data-redirect') || target.getAttribute('href') || '/account/';
					if (currentRedirect === '#') currentRedirect = '/account/';
					if (currentRedirect && !currentRedirect.startsWith('http') && !currentRedirect.startsWith('/')) {
						currentRedirect = '/' + currentRedirect;
					}
					// カスタムテキストを取得
					currentCustomText = target.getAttribute('data-lw-shop-text') || '';
					// アクティベートページからのログインかどうか
					isFromActivatePage = target.hasAttribute('data-lw-activate-page');
					handleShopAction();
					return;
				}

				// .lw-shop-login-trigger クラスまたは管理バーのステータスリンク
				var triggerTarget = e.target.closest('.lw-shop-login-trigger, #wp-admin-bar-liteword-status > a, #wp-admin-bar-liteword-status');
				if (triggerTarget) {
					e.preventDefault();
					currentRedirect = '/account/';
					currentCustomText = '';
					handleShopAction();
					return;
				}
			});

			// トークンがない場合のログインフォーム処理
			if (!hasToken) {
				var newLoginBtn = document.getElementById('lw-shop-new-login-btn');
				var newLoginId = document.getElementById('lw-shop-new-login-id');
				var newLoginPassword = document.getElementById('lw-shop-new-login-password');
				var newLoginError = document.getElementById('lw-shop-new-login-error');

				if (newLoginBtn) {
					newLoginBtn.addEventListener('click', handleNewLogin);
				}
				if (newLoginPassword) {
					newLoginPassword.addEventListener('keypress', function(e) {
						if (e.key === 'Enter') handleNewLogin();
					});
				}

				function handleNewLogin() {
					var loginId = newLoginId ? newLoginId.value.trim() : '';
					var password = newLoginPassword ? newLoginPassword.value : '';

					if (!loginId || !password) {
						showNewLoginError('メールアドレスとパスワードを入力してください');
						return;
					}

					hideNewLoginError();
					newLoginBtn.disabled = true;
					newLoginBtn.innerHTML = '<span class="spinner is-active" style="float:none;margin:0;"></span> ログイン中...';

					fetch(shopUrl + '/wp-json/liteword/v1/login-and-get-token', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							login: loginId,
							password: password,
							site_url: siteUrl
						})
					})
					.then(function(response) { return response.json(); })
					.then(function(data) {
						if (data.success && data.access_token && data.one_time_token) {
							// トークンをWordPressに保存
							saveTokenToWordPress(data.access_token, function(saved) {
								if (saved) {
									// アクティベートページからのログインの場合、カスタムイベントを発火
									if (isFromActivatePage) {
										var event = new CustomEvent('lw-activate-login-success', {
											detail: { accessToken: data.access_token }
										});
										document.dispatchEvent(event);
										closeModal();
										return;
									}

									// 成功 → フォームを非表示にして成功メッセージを表示
									var loginForm = document.querySelector('#lw-shop-no-token .lw-shop-login-form');
									var successArea = document.getElementById('lw-shop-new-login-success');
									var upgradeBtn = document.getElementById('lw-shop-upgrade-btn');
									var accountBtn = document.getElementById('lw-shop-account-btn');
									var leadText = document.querySelector('#lw-shop-no-token .lw-shop-login-lead');
									var registerText = leadText ? leadText.nextElementSibling : null;

									if (loginForm) loginForm.style.display = 'none';
									if (leadText) leadText.style.display = 'none';
									if (registerText) registerText.style.display = 'none';

									// ボタンのURLを設定（ワンタイムトークン付き）
									var token = encodeURIComponent(data.one_time_token);
									if (upgradeBtn) {
										upgradeBtn.href = shopUrl + '/purchase-premium/?lw_auto_login=' + token;
									}
									if (accountBtn) {
										accountBtn.href = shopUrl + '/account/?lw_auto_login=' + token;
									}

									if (successArea) successArea.style.display = 'block';
								} else {
									showNewLoginError('トークンの保存に失敗しました');
									resetNewLoginBtn();
								}
							});
						} else {
							showNewLoginError(data.message || 'ログインに失敗しました');
							resetNewLoginBtn();
						}
					})
					.catch(function(error) {
						showNewLoginError('通信エラーが発生しました');
						resetNewLoginBtn();
					});
				}

				function showNewLoginError(msg) {
					if (newLoginError) {
						newLoginError.textContent = msg;
						newLoginError.style.display = 'block';
					}
				}

				function hideNewLoginError() {
					if (newLoginError) newLoginError.style.display = 'none';
				}

				function resetNewLoginBtn() {
					if (newLoginBtn) {
						newLoginBtn.disabled = false;
						newLoginBtn.innerHTML = '<span class="dashicons dashicons-yes"></span> ログインして接続';
					}
				}

				// トークンをWordPressユーザーメタに保存
				function saveTokenToWordPress(token, callback) {
					var formData = new FormData();
					formData.append('action', 'lw_save_shop_token');
					formData.append('nonce', saveTokenNonce);
					formData.append('token', token);

					fetch(ajaxUrl, {
						method: 'POST',
						body: formData,
						credentials: 'same-origin'
					})
					.then(function(response) { return response.json(); })
					.then(function(data) {
						callback(data.success === true);
					})
					.catch(function(error) {
						callback(false);
					});
				}

				// モーダル閉じるボタン
				modal.querySelectorAll('.lw-modal-close, [data-modal-close]').forEach(function(btn) {
					btn.addEventListener('click', closeModal);
				});
				// オーバーレイクリックで閉じる
				modal.addEventListener('click', function(e) {
					if (e.target === modal) {
						closeModal();
					}
				});
				return; // 以降の初期化はスキップ
			}

			// パスワード認証ボタン
			if (passwordBtn) {
				passwordBtn.addEventListener('click', handlePasswordAuth);
			}

			// Enterキーでパスワード認証
			if (passwordInput) {
				passwordInput.addEventListener('keypress', function(e) {
					if (e.key === 'Enter') {
						handlePasswordAuth();
					}
				});
			}

			// ヘルプボックスのトグル
			var helpToggle = document.getElementById('lw-shop-help-toggle');
			var helpBox = document.getElementById('lw-shop-help-box');
			var userInfoText = document.getElementById('lw-shop-user-info-text');
			var userInfoLoaded = false;

			if (helpToggle && helpBox) {
				helpToggle.addEventListener('click', function(e) {
					e.preventDefault();
					var isOpening = helpBox.style.display === 'none';
					helpBox.style.display = isOpening ? 'block' : 'none';

					// ヘルプを開く時、トークンがあればユーザー情報を取得
					if (isOpening && hasToken && !userInfoLoaded && userInfoText) {
						fetch(shopUrl + '/wp-json/liteword/v1/get-user-info', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ token: accessToken })
						})
						.then(function(res) { return res.json(); })
						.then(function(data) {
							if (data.success && data.display_name) {
								userInfoText.innerHTML = '<strong>' + data.display_name + '</strong> 様は <strong>' + data.registered_date + '</strong> に登録し、LiteWordのご利用を開始されています。';
								userInfoText.style.display = 'block';
								userInfoLoaded = true;
							}
						})
						.catch(function() {});
					}
				});
			}

			// モーダル閉じるボタン
			modal.querySelectorAll('.lw-modal-close, [data-modal-close]').forEach(function(btn) {
				btn.addEventListener('click', closeModal);
			});

			// トークン無効時の閉じるボタン
			var tokenRequiredCloseBtn = document.getElementById('lw-shop-token-required-close');
			if (tokenRequiredCloseBtn) {
				tokenRequiredCloseBtn.addEventListener('click', closeModal);
			}

			// オーバーレイクリックで閉じる
			modal.addEventListener('click', function(e) {
				if (e.target === modal) {
					closeModal();
				}
			});

			// リンクボタンクリック時にモーダルを閉じる（ワンタイムトークンは1回のみ有効）
			modal.addEventListener('click', function(e) {
				var closeBtn = e.target.closest('.lw-shop-close-on-click');
				if (closeBtn) {
					// リンク遷移後にモーダルを閉じる
					setTimeout(function() {
						closeModal();
					}, 100);
				}
			});
		});

		// ショップアクションのハンドラ
		function handleShopAction() {
			if (!hasToken) {
				// トークンがない場合は単にモーダルを表示
				showModal();
				return;
			}
			// トークンがある場合はドメイン認証をチェック
			checkDomainVerification();
		}

		function checkDomainVerification() {
			showModal();
			showStatus();

			// APIでドメイン認証状態を確認
			fetch(shopUrl + '/wp-json/liteword/v1/generate-login-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token: accessToken,
					site_url: siteUrl
				})
			})
			.then(function(response) { return response.json(); })
			.then(function(data) {
				if (data.token) {
					// 認証済み → ボタンを表示してユーザーにクリックさせる
					var goUpgradeBtn = document.getElementById('lw-shop-go-upgrade-btn');
					var goAccountBtn = document.getElementById('lw-shop-go-account-btn');
					var token = encodeURIComponent(data.token);

					if (goUpgradeBtn) {
						goUpgradeBtn.href = shopUrl + '/purchase-premium/?lw_auto_login=' + token;
					}
					if (goAccountBtn) {
						goAccountBtn.href = shopUrl + '/account/?lw_auto_login=' + token;
					}

					// ステータスを非表示にして認証済み画面を表示
					statusArea.style.display = 'none';
					verifiedArea.style.display = 'block';
				} else if (data.code === 'domain_not_verified') {
					// ドメイン未認証 → 認証フォーム表示（ユーザーIDを事前入力）
					showAuthRequired(data.user_login || '');
				} else if (data.code === 'invalid_token' || data.code === 'no_token') {
					// トークンが無効
					if (isFromActivatePage) {
						// アクティベートページからの場合はログインフォームを表示
						isTokenInvalid = true;
						showAuthRequired('');
						// メッセージを変更
						var leadText = document.getElementById('lw-shop-auth-lead-text');
						if (leadText) {
							leadText.innerHTML = 'トークンが無効です。<br>再度ログインしてください。';
						}
					} else {
						// 他のページからの場合は設定ページへ誘導
						showTokenRequired();
					}
				} else {
					// その他のエラー
					statusArea.style.display = 'none';
					showAuthRequired('');
					showError(data.message || 'エラーが発生しました');
				}
			})
			.catch(function(error) {
				// 通信エラー時も設定が必要なメッセージを表示
				showTokenRequired();
			});
		}

		function handlePasswordAuth() {
			var loginId = loginIdInput.value.trim();
			var password = passwordInput.value;

			if (!loginId || !password) {
				showError('メールアドレスとパスワードを入力してください');
				return;
			}

			hideError();
			passwordBtn.disabled = true;
			passwordBtn.innerHTML = '<span class="spinner is-active" style="float:none;margin:0;"></span> 認証中...';

			// トークンが無効な場合は login-and-get-token を使用
			if (isTokenInvalid) {
				fetch(shopUrl + '/wp-json/liteword/v1/login-and-get-token', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						login: loginId,
						password: password,
						site_url: siteUrl
					})
				})
				.then(function(response) { return response.json(); })
				.then(function(data) {
					if (data.success && data.access_token && data.one_time_token) {
						// 新しいトークンをWordPressに保存
						saveTokenToWordPress(data.access_token, function(saved) {
							if (saved) {
								// アクティベートページからのログインの場合、カスタムイベントを発火
								if (isFromActivatePage) {
									var event = new CustomEvent('lw-activate-login-success', {
										detail: { accessToken: data.access_token }
									});
									document.dispatchEvent(event);
									closeModal();
									return;
								}

								// 成功 → ボタンを表示
								var goUpgradeBtn = document.getElementById('lw-shop-go-upgrade-btn');
								var goAccountBtn = document.getElementById('lw-shop-go-account-btn');
								var token = encodeURIComponent(data.one_time_token);

								authRequired.style.display = 'none';

								if (goUpgradeBtn) {
									goUpgradeBtn.href = shopUrl + '/purchase-premium/?lw_auto_login=' + token;
								}
								if (goAccountBtn) {
									goAccountBtn.href = shopUrl + '/account/?lw_auto_login=' + token;
								}

								// グローバル変数を更新
								accessToken = data.access_token;
								isTokenInvalid = false;

								verifiedArea.style.display = 'block';
							} else {
								showError('トークンの保存に失敗しました');
								resetPasswordBtn();
							}
						});
					} else {
						showError(data.message || 'ログインに失敗しました');
						resetPasswordBtn();
					}
				})
				.catch(function() {
					showError('通信エラーが発生しました');
					resetPasswordBtn();
				});
				return;
			}

			// 通常のドメイン認証
			fetch(shopUrl + '/wp-json/liteword/v1/verify-domain-with-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token: accessToken,
					site_url: siteUrl,
					login: loginId,
					password: password
				})
			})
			.then(function(response) { return response.json(); })
			.then(function(data) {
				if (data.success) {
					// 認証成功 → ワンタイムトークンを取得してボタンのhrefを設定
					fetch(shopUrl + '/wp-json/liteword/v1/generate-login-token', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							token: accessToken,
							site_url: siteUrl
						})
					})
					.then(function(res) { return res.json(); })
					.then(function(tokenData) {
						if (tokenData.token) {
							// アクティベートページからのログインの場合、カスタムイベントを発火
							if (isFromActivatePage) {
								var event = new CustomEvent('lw-activate-login-success', {
									detail: { accessToken: accessToken }
								});
								document.dispatchEvent(event);
								closeModal();
								return;
							}

							// フォームエリアを非表示にして成功メッセージを表示
							var goUpgradeBtn = document.getElementById('lw-shop-go-upgrade-btn');
							var goAccountBtn = document.getElementById('lw-shop-go-account-btn');

							authRequired.style.display = 'none';

							// ボタンのURLを設定（ワンタイムトークン付き）
							var token = encodeURIComponent(tokenData.token);
							if (goUpgradeBtn) {
								goUpgradeBtn.href = shopUrl + '/purchase-premium/?lw_auto_login=' + token;
							}
							if (goAccountBtn) {
								goAccountBtn.href = shopUrl + '/account/?lw_auto_login=' + token;
							}

							verifiedArea.style.display = 'block';
						} else {
							showError('トークンの取得に失敗しました');
							resetPasswordBtn();
						}
					})
					.catch(function() {
						showError('通信エラーが発生しました');
						resetPasswordBtn();
					});
				} else {
					showError(data.message || '認証に失敗しました');
					resetPasswordBtn();
				}
			})
			.catch(function(error) {
				showError('通信エラーが発生しました');
				resetPasswordBtn();
			});
		}

		// トークンをWordPressユーザーメタに保存（has_token時にも使用）
		function saveTokenToWordPress(token, callback) {
			var formData = new FormData();
			formData.append('action', 'lw_save_shop_token');
			formData.append('nonce', saveTokenNonce);
			formData.append('token', token);

			fetch(ajaxUrl, {
				method: 'POST',
				body: formData,
				credentials: 'same-origin'
			})
			.then(function(response) { return response.json(); })
			.then(function(data) {
				callback(data.success === true);
			})
			.catch(function(error) {
				callback(false);
			});
		}

		function resetPasswordBtn() {
			passwordBtn.disabled = false;
			passwordBtn.innerHTML = '<span class="dashicons dashicons-yes"></span> 認証してアクセス';
		}

		function showStatus() {
			statusArea.style.display = 'block';
			authRequired.style.display = 'none';
		}

		function showAuthRequired(userLogin) {
			statusArea.style.display = 'none';
			authRequired.style.display = 'block';
			verifiedArea.style.display = 'none';
			if (tokenRequiredArea) tokenRequiredArea.style.display = 'none';
			// カスタムテキストがあれば表示
			var leadText = document.getElementById('lw-shop-auth-lead-text');
			if (leadText) {
				leadText.innerHTML = currentCustomText || defaultAuthText;
			}
			// ログインIDを事前入力
			if (userLogin && loginIdInput) {
				loginIdInput.value = userLogin;
			}
		}

		function showTokenRequired() {
			statusArea.style.display = 'none';
			authRequired.style.display = 'none';
			verifiedArea.style.display = 'none';
			if (tokenRequiredArea) tokenRequiredArea.style.display = 'block';
		}

		function showError(message) {
			errorArea.textContent = message;
			errorArea.style.display = 'block';
		}

		function hideError() {
			if (errorArea) errorArea.style.display = 'none';
		}
	})();
	</script>
	<?php
}
