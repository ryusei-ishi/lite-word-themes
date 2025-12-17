<?php
/**
 * コーディング特化モード - リアルタイムプレビュー専用ページ
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ★ admin_action フックで呼び出される
add_action( 'admin_action_lw_code_preview', 'lw_render_code_preview' );

function lw_render_code_preview() {
	// 権限チェック
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_die( 'アクセス権限がありません。' );
	}
	
	// パラメータ取得
	$post_id = isset( $_GET['post_id'] ) ? intval( $_GET['post_id'] ) : 0;
	
	if ( ! $post_id ) {
		wp_die( '投稿IDが指定されていません。' );
	}
	
	// Nonce検証
	if ( ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( $_GET['_wpnonce'], 'lw_preview_' . $post_id ) ) {
		wp_die( 'セキュリティチェックに失敗しました。' );
	}
	
	// 投稿を取得
	$post = get_post( $post_id );
	
	if ( ! $post || $post->post_type !== 'lw_my_parts' ) {
		wp_die( 'マイパーツが見つかりません。' );
	}
	
	?>
	<!DOCTYPE html>
	<html lang="ja">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>プレビュー - <?php echo esc_html( $post->post_title ); ?></title>
		
		<!-- ★ テーマのCSS -->
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/css/reset.min.css?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>">
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/css/common.min.css?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>">
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/css/page.min.css?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>">
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/css/register_block.min.css?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>">
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/css/font_style.min.css?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>">
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/css/anime.min.css?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>">
		
		<!-- ★ プレビュー専用CSS -->
		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
			body {
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
				background: #f5f5f5;
			}
			#lw-preview-header {
				position: sticky;
				top: 0;
				background: #2d2d30;
				color: #fff;
				padding: 10px 20px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #3e3e42;
				z-index: 10000;
			}
			#lw-preview-title {
				font-size: 14px;
				font-weight: 600;
			}
			#lw-preview-status {
				font-size: 12px;
				color: #16825d;
			}
			/* ★ テーマのHTML構造用のスタイル調整 */
			.lw_content_wrap {
				min-height: calc(100vh - 50px);
			}
			#lw-preview-content {
				/* コンテンツ部分は特別なスタイルを適用しない */
				/* テーマのCSSに任せる */
			}
		</style>
		<style id="lw-custom-styles"></style>
	</head>
	<body>
		<div id="lw-preview-header">
			<div id="lw-preview-title">🔄 リアルタイムプレビュー - <?php echo esc_html( $post->post_title ); ?></div>
			<div id="lw-preview-status">✅ 接続中</div>
		</div>
		
		<!-- ★ テーマのHTML構造 -->
		<div class="lw_content_wrap page">
			<div class="main_content">
				<section class="post_content">
					<div class="post_style page">
						
						<!-- ★ プレビューコンテンツをここに表示 -->
						<div id="lw-preview-content">
							<!-- ここにコンテンツが表示されます -->
						</div>
						
					</div>
				</section>
			</div>
		</div>
		
		<!-- ★ jQuery（WordPressのjQuery） -->
		<script src="<?php echo includes_url('js/jquery/jquery.min.js'); ?>"></script>
		
		<!-- ★ MyThemeSettings定義（swiper_cdn.js用） -->
		<script>
			var MyThemeSettings = {
				theme_Url: '<?php echo get_template_directory_uri(); ?>',
				themeUrl: '<?php echo get_template_directory_uri(); ?>'
			};
		</script>
		
		<!-- ★ テーマのJavaScript -->
		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/swiper_cdn.js"></script>
		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/common.js?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>"></script>
		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/font_cdn.js?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>"></script>
		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/font.js?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>"></script>
		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/animation-front.js?ver=<?php echo function_exists('css_version') ? css_version() : '1.0'; ?>"></script>
		
		<!-- ★ プレビュー機能のスクリプト -->
		<script>
			// 実行済みスクリプトを管理
			var lw_executed_scripts = [];
			
			// postMessageでコンテンツを受信
			window.addEventListener('message', function(event) {
				if (event.data && event.data.type === 'lw_preview_update') {
					var html = event.data.html || '';
					var css = event.data.css || '';
					var js = event.data.js || '';  // ★ JavaScript追加
					var fullWidth = event.data.fullWidth || false;
					
					// ★★ デバッグログ追加
					console.log('📥 プレビューで受信:', {
						htmlLength: html.length,
						cssLength: css.length,
						jsLength: js.length,
						jsPreview: js.substring(0, 100),
						hasJS: js.length > 0,
						fullWidth: fullWidth
					});
					
					// HTML更新
					var contentDiv = document.getElementById('lw-preview-content');
					if (contentDiv) {
						contentDiv.innerHTML = html;
						
						// ★ 全幅表示のクラスを付与/削除
						if (fullWidth) {
							contentDiv.classList.add('lw_width_full_on');
						} else {
							contentDiv.classList.remove('lw_width_full_on');
						}
						
						// ★ Swiperが存在するか確認
						var hasSwiperElements = contentDiv.querySelectorAll('.swiper').length > 0;
						
						// ★ HTML更新後にテーマのJavaScriptを再初期化
						setTimeout(function() {
							// jQueryのready状態をトリガー
							if (typeof jQuery !== 'undefined') {
								jQuery(document).trigger('lw_preview_content_updated');
							}
							
							// common.jsの初期化関数があれば実行
							if (typeof window.initCommonScripts === 'function') {
								window.initCommonScripts();
							}
							
							// アニメーションの初期化
							if (typeof window.initAnimations === 'function') {
								window.initAnimations();
							}
							
							// ★★ Swiperが存在する場合の処理
							if (hasSwiperElements) {
								console.log('🎠 Swiper要素を検出しました');
								
								// Swiperが既にロード済みの場合
								if (typeof Swiper !== 'undefined') {
									console.log('✅ Swiper already loaded');
									initializeSwipers();
								} else {
									// Swiperがまだロードされていない場合、強制的にロード
									console.log('⏳ Swiperをロード中...');
									
									// swiper_cdn.jsの読み込みをトリガー（MutationObserverをトリガー）
									// 新しいdivを挿入してMutationObserverを発火させる
									var triggerDiv = document.createElement('div');
									triggerDiv.className = 'swiper-trigger-element';
									triggerDiv.style.display = 'none';
									contentDiv.appendChild(triggerDiv);
									
									// lw:swiperReadyイベントを待つ
									var swiperReadyHandler = function() {
										console.log('✅ Swiper loaded successfully');
										window.removeEventListener('lw:swiperReady', swiperReadyHandler);
										initializeSwipers();
									};
									window.addEventListener('lw:swiperReady', swiperReadyHandler);
									
									// タイムアウト処理（3秒以内にロードされない場合）
									setTimeout(function() {
										if (typeof Swiper === 'undefined') {
											console.warn('⚠️ Swiper読み込みタイムアウト');
											window.removeEventListener('lw:swiperReady', swiperReadyHandler);
										}
									}, 3000);
								}
							}
							
							console.log('テーマJavaScript再初期化完了');
						}, 100);
					}
					
					// ★★ Swiper初期化関数
					function initializeSwipers() {
						// 既存のSwiperインスタンスを破棄
						var swipers = document.querySelectorAll('.swiper-container');
						swipers.forEach(function(el) {
							if (el.swiper) {
								el.swiper.destroy(true, true);
							}
						});
						
						// 新しいSwiperを初期化
						if (typeof window.initSwipers === 'function') {
							window.initSwipers();
						} else {
							// 基本的なSwiper初期化（フォールバック）
							var swiperContainers = document.querySelectorAll('.swiper');
							swiperContainers.forEach(function(container) {
								new Swiper(container, {
									loop: true,
									autoplay: {
										delay: 3000,
										disableOnInteraction: false,
									},
									pagination: {
										el: '.swiper-pagination',
										clickable: true,
									},
									navigation: {
										nextEl: '.swiper-button-next',
										prevEl: '.swiper-button-prev',
									},
								});
							});
						}
						console.log('🎠 Swiper初期化完了');
					}
					
					
					// CSS更新
					var styleTag = document.getElementById('lw-custom-styles');
					if (styleTag) {
						styleTag.textContent = css;
					}
					
					// ★★ JavaScript実行を遅延（DOM更新完了後に実行）
					setTimeout(function() {
						if (js && js.trim()) {
							console.log('⚡ JavaScript実行開始...', {
								jsLength: js.length,
								jsPreview: js.substring(0, 200)
							});
							
							try {
								// 既存のカスタムスクリプトを削除
								var oldScripts = document.querySelectorAll('script[data-lw-custom-script]');
								oldScripts.forEach(function(script) {
									console.log('🗑️ 既存スクリプトを削除');
									script.remove();
								});
								
								// 新しいスクリプトを作成
								var scriptElement = document.createElement('script');
								scriptElement.setAttribute('data-lw-custom-script', 'true');
								
								// ★★ DOMが利用可能な状態でJSを実行するためにラップ
								var wrappedJS = '(function() {\n' +
									'  "use strict";\n' +
									'  console.log("🚀 カスタムJS実行開始");\n' +
									'  try {\n' +
									js + '\n' +
									'    console.log("✅ カスタムJS実行成功");\n' +
									'  } catch(e) {\n' +
									'    console.error("❌ カスタムJS内でエラー:", e);\n' +
									'  }\n' +
									'})();';
								
								scriptElement.textContent = wrappedJS;
								document.body.appendChild(scriptElement);
								
								console.log('✅ カスタムJavaScript実行完了');
							} catch(error) {
								console.error('❌ JavaScript実行エラー:', error);
								console.error('エラー詳細:', error.message, error.stack);
							}
						} else {
							console.log('ℹ️ JavaScriptは空です');
							// JSが空の場合は既存のスクリプトを削除
							var oldScripts = document.querySelectorAll('script[data-lw-custom-script]');
							oldScripts.forEach(function(script) {
								script.remove();
							});
						}
					}, 200); // ★★ テーマのJS初期化(100ms)の後に実行
					
					// ステータス更新
					var status = document.getElementById('lw-preview-status');
					if (status) {
						status.textContent = '✅ 更新: ' + new Date().toLocaleTimeString('ja-JP') + 
						                     (fullWidth ? ' [全幅ON]' : '') +
						                     (js.length > 0 ? ' [JS有]' : '');
					}
					
					console.log('プレビュー更新完了', {
						htmlLength: html.length,
						cssLength: css.length,
						jsLength: js.length,
						fullWidth: fullWidth
					});
				}
			});
			
			// 親ウィンドウに準備完了を通知
			if (window.opener) {
				window.opener.postMessage({
					type: 'lw_preview_ready',
					postId: <?php echo $post_id; ?>
				}, '*');
				console.log('✅ プレビューウィンドウ準備完了を通知しました');
			}
			
			console.log('📺 プレビューウィンドウ準備完了');
		</script>
	</body>
	</html>
	<?php
	exit;
}