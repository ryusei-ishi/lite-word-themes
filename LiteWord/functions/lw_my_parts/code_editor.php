<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * コードエディタ機能
 * マイパーツに HTML/CSS/JavaScript コードエディタを追加
 */

/* ==========================================================
 * 1. エディタモード切り替えメタボックス（サイドバー）
 * ======================================================= */
add_action( 'add_meta_boxes', 'lw_add_editor_mode_metabox' );
function lw_add_editor_mode_metabox() {
	add_meta_box(
		'lw_editor_mode_box',
		'✏️ 編集モード',
		'lw_render_editor_mode_metabox',
		'lw_my_parts',
		'side',
		'high'
	);
}

function lw_render_editor_mode_metabox( $post ) {
	wp_nonce_field( 'lw_save_editor_mode', 'lw_editor_mode_nonce' );
	
	$editor_mode = get_post_meta( $post->ID, '_lw_editor_mode', true );
	if ( empty( $editor_mode ) ) {
		$editor_mode = 'normal';
	}
	
	$full_width = get_post_meta( $post->ID, '_lw_full_width', true );
	$is_full_width = ( $full_width === 'on' );
	?>
	<div style="padding: 10px 0;">
		<!-- ★ コーディング特化モードボタン -->
		<?php if ( 'code' === $editor_mode ) : ?>
		<div style="margin-bottom: 15px;">
			<button type="button" id="lw-open-fullscreen-editor" class="button button-primary button-large" style="width: 100%; padding: 10px; font-size: 14px; font-weight: bold;">
				🚀 コーディング特化モード
			</button>
			<p style="margin: 8px 0 0 0; font-size: 11px; color: #666; text-align: center;">
				軽量なエディタで高速編集
			</p>
		</div>
		<?php endif; ?>
		
		<label style="display: block; margin-bottom: 10px;">
			<input type="radio" name="lw_editor_mode" value="normal" <?php checked( $editor_mode, 'normal' ); ?>>
			<strong>通常エディタ</strong>
			<span style="display: block; font-size: 12px; color: #666; margin-left: 24px;">
				Gutenbergエディタ
			</span>
		</label>
		
		<label style="display: block; margin-top: 15px;">
			<input type="radio" name="lw_editor_mode" value="code" <?php checked( $editor_mode, 'code' ); ?>>
			<strong>コードエディタ</strong>
			<span style="display: block; font-size: 12px; color: #666; margin-left: 24px;">
				HTML + CSS + JavaScript
			</span>
		</label>
		
		<div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
			<label style="display: flex; align-items: center; justify-content: space-between;">
				<span style="font-weight: bold;">全幅表示</span>
				<div class="lw-toggle-switch">
					<input 
						type="checkbox" 
						id="lw_full_width_toggle" 
						name="lw_full_width" 
						value="on" 
						<?php checked( $is_full_width, true ); ?>
						style="display: none;"
					>
					<label for="lw_full_width_toggle" class="lw-toggle-label">
						<span class="lw-toggle-inner"></span>
						<span class="lw-toggle-switch-slider"></span>
					</label>
				</div>
			</label>
			<p style="margin: 8px 0 0 0; font-size: 11px; color: #666;">
				ONにすると、コンテナ幅を無視して全幅表示になります
			</p>
		</div>
	</div>
	
	<!-- 保存中インジケーター -->
	<div id="lw-saving-indicator" style="display: none; margin-top: 15px; padding: 10px; background: #fff3cd; border-left: 3px solid #ffc107; font-size: 12px;">
		<strong>💾 保存中...</strong><br>
		しばらくお待ちください
	</div>
	
	<div style="margin-top: 15px; padding: 10px; background: #f0f6fc; border-left: 3px solid #0073aa; font-size: 12px;">
		<strong>💡 ヒント</strong><br>
		コードエディタモードでは、HTMLとCSSとJavaScriptを直接記述できます。<br>
		<span style="color: #d63638; font-weight: bold;">モード切り替え時は自動保存されます</span>
	</div>
	
	<script>
	jQuery(document).ready(function($) {
		// ★ コーディング特化モードボタン
		$('#lw-open-fullscreen-editor').on('click', function(e) {
			e.preventDefault();
			var postId = <?php echo $post->ID; ?>;
			var url = ajaxurl.replace('admin-ajax.php', 'admin.php') + 
			          '?action=lw_code_editor_fullscreen&post_id=' + postId +
			          '&_wpnonce=<?php echo wp_create_nonce('lw_fullscreen_editor_' . $post->ID); ?>';
			
			// 新しいウィンドウのサイズと位置
			var width = screen.width * 0.9;
			var height = screen.height * 0.9;
			var left = (screen.width - width) / 2;
			var top = (screen.height - height) / 2;
			
			// 新しいウィンドウで開く
			var editorWindow = window.open(
				url, 
				'lw_fullscreen_editor',
				'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes'
			);
			
			// ウィンドウが正常に開いたら、現在のページを一覧に移動
			if (editorWindow) {
				// 少し待ってから一覧ページに移動（ウィンドウが開くのを確認）
				setTimeout(function() {
					window.location.href = 'edit.php?post_type=lw_my_parts';
				}, 500);
			} else {
				// ポップアップがブロックされた場合
				alert('ポップアップがブロックされました。\nブラウザの設定でポップアップを許可してください。');
			}
		});
	});
	</script>
	
	<style>
	.lw-toggle-switch {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 24px;
	}
	
	.lw-toggle-label {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: .4s;
		border-radius: 24px;
	}
	
	.lw-toggle-label:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: .4s;
		border-radius: 50%;
	}
	
	input:checked + .lw-toggle-label {
		background-color: #0073aa;
	}
	
	input:checked + .lw-toggle-label:before {
		transform: translateX(26px);
	}
	
	.lw-toggle-label:hover {
		opacity: 0.8;
	}
	</style>
	<?php
}

/* ==========================================================
 * 2. ★ コードモード時のみGutenbergエディタを削除
 * ======================================================= */
add_action( 'admin_init', 'lw_remove_editor_for_code_mode' );
function lw_remove_editor_for_code_mode() {
	if ( ! is_admin() ) {
		return;
	}
	
	global $pagenow;
	if ( ! in_array( $pagenow, array( 'post.php', 'post-new.php' ) ) ) {
		return;
	}
	
	if ( isset( $_GET['post_type'] ) && $_GET['post_type'] !== 'lw_my_parts' ) {
		return;
	}
	
	if ( isset( $_GET['post'] ) ) {
		$post_id = intval( $_GET['post'] );
		$editor_mode = get_post_meta( $post_id, '_lw_editor_mode', true );
		
		if ( 'code' === $editor_mode ) {
			remove_post_type_support( 'lw_my_parts', 'editor' );
		}
	}
}

/* ==========================================================
 * 3. コードエディタメタボックス（メインエリア）
 * ======================================================= */
add_action( 'add_meta_boxes', 'lw_add_code_editor_metabox' );
function lw_add_code_editor_metabox() {
	add_meta_box(
		'lw_code_editor_box',
		'💻 コードエディタ（HTML + CSS + JavaScript）',
		'lw_render_code_editor_metabox',
		'lw_my_parts',
		'normal',
		'high'
	);
}

function lw_render_code_editor_metabox( $post ) {
	wp_nonce_field( 'lw_save_code_editor', 'lw_code_editor_nonce' );
	
	$editor_mode = get_post_meta( $post->ID, '_lw_editor_mode', true );
	$custom_html = get_post_meta( $post->ID, '_lw_custom_html', true );
	$custom_css = get_post_meta( $post->ID, '_lw_custom_css', true );
	$custom_js = get_post_meta( $post->ID, '_lw_custom_js', true ); // ★ JS変数追加
	
	$display = ( 'code' === $editor_mode ) ? 'block' : 'none';
	?>
	
	<div id="lw-code-editor-container" style="display: <?php echo esc_attr( $display ); ?>;">
		<!-- AI生成セクション -->
		<?php
		$has_api_key = class_exists( 'LW_AI_Generator_Admin_Settings' ) && ! empty( LW_AI_Generator_Admin_Settings::get_api_key() );
		$is_premium = defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true;
		?>
		<div id="lw-ai-generate-section" style="margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: #fff;">
			<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M12 2L2 7l10 5 10-5-10-5z"/>
					<path d="M2 17l10 5 10-5"/>
					<path d="M2 12l10 5 10-5"/>
				</svg>
				<strong style="font-size: 16px;">AI パーツ生成</strong>
				<span style="background: rgba(255,193,7,0.9); color: #333; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">Beta版</span>
				<?php if ( ! $is_premium ) : ?>
				<span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; font-size: 11px;">プレミアム機能</span>
				<?php endif; ?>
			</div>

			<!-- プレビュー確認ダイアログ -->
			<div id="lw-ai-preview-dialog" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 100000; overflow-y: auto;">
				<div style="max-width: 700px; margin: 50px auto; background: #fff; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
					<div style="padding: 20px 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0; color: #fff;">
						<h3 style="margin: 0; font-size: 18px; display: flex; align-items: center; gap: 10px;">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="12" cy="12" r="10"/>
								<line x1="12" y1="16" x2="12" y2="12"/>
								<line x1="12" y1="8" x2="12.01" y2="8"/>
							</svg>
							AIの分析結果を確認
						</h3>
						<p style="margin: 10px 0 0 0; font-size: 13px; opacity: 0.9;">参考画像から検出した内容です。必要に応じて修正してから生成してください。</p>
					</div>
					<div id="lw-ai-preview-content" style="padding: 25px; color: #333;">
						<!-- 動的に内容が入る -->
					</div>
					<div style="padding: 20px 25px; background: #f5f5f5; border-radius: 0 0 12px 12px; display: flex; justify-content: space-between; align-items: center; gap: 15px;">
						<button type="button" id="lw-ai-preview-cancel" class="button" style="padding: 10px 25px;">
							キャンセル
						</button>
						<div style="display: flex; gap: 10px;">
							<button type="button" id="lw-ai-preview-regenerate" class="button" style="padding: 10px 20px;">
								<span class="dashicons dashicons-update" style="font-size: 16px; vertical-align: middle; margin-right: 5px;"></span>
								再分析
							</button>
							<button type="button" id="lw-ai-preview-confirm" class="button button-primary" style="padding: 10px 30px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
								<span class="lw-confirm-text">この内容で生成</span>
								<span class="lw-confirm-loading" style="display: none;">
									<span class="spinner is-active" style="float: none; margin: 0 5px 0 0;"></span>
									生成中...
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<?php if ( ! $has_api_key ) : ?>
			<div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
				<p style="margin: 0 0 10px 0;">AI機能を使用するにはAPIキーの設定が必要です。</p>
				<a href="<?php echo admin_url( 'options-general.php?page=lw-ai-generator-settings' ); ?>" class="button" style="background: #fff; color: #667eea; border: none;">
					設定画面へ
				</a>
			</div>
			<?php elseif ( ! $is_premium ) : ?>
			<div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px;">
				<p style="margin: 0 0 10px 0;">AIパーツ生成はプレミアムプラン限定機能です。</p>
				<a href="<?php echo admin_url( 'index.php?show_premium_popup=1' ); ?>" target="_blank" class="button" style="background: #fff; color: #667eea; border: none;">
					プレミアムプランを見る
				</a>
			</div>
			<?php else : ?>
			<div style="display: flex; flex-direction: column; gap: 12px;">
				<div style="display: flex; gap: 10px; flex-wrap: wrap;">
					<div style="flex: 1; min-width: 150px;">
						<label style="font-size: 12px; opacity: 0.9; display: block; margin-bottom: 4px;">パーツの種類</label>
						<select id="lw-ai-parts-type" style="width: 100%; padding: 8px 12px; border: none; border-radius: 4px; font-size: 14px;">
							<option value="">自動判定</option>
							<option value="fv">ファーストビュー</option>
							<option value="intro">イントロダクション</option>
							<option value="feature">特徴・機能紹介</option>
							<option value="voice">お客様の声</option>
							<option value="flow">ステップ・フロー</option>
							<option value="faq">よくある質問</option>
							<option value="cta">CTA・お問い合わせ</option>
							<option value="gallery">ギャラリー</option>
							<option value="price">料金表</option>
							<option value="other">その他</option>
						</select>
					</div>
					<div style="width: 100px;">
						<label style="font-size: 12px; opacity: 0.9; display: block; margin-bottom: 4px;">番号 <span id="lw-ai-number-auto" style="opacity: 0.7;">(自動)</span></label>
						<input type="number" id="lw-ai-parts-number" value="1" min="1" max="99" style="width: 100%; padding: 8px 12px; border: none; border-radius: 4px; font-size: 14px;" readonly>
					</div>
					<div style="flex: 1; min-width: 180px;">
						<label style="font-size: 12px; opacity: 0.9; display: block; margin-bottom: 4px;">AIモデル</label>
						<select id="lw-ai-model" style="width: 100%; padding: 8px 12px; border: none; border-radius: 4px; font-size: 14px;">
							<option value="gemini-2.5-flash">Gemini 2.5 Flash（推奨）</option>
							<option value="gemini-2.5-pro">Gemini 2.5 Pro（高品質）</option>
							<option value="gemini-2.0-flash">Gemini 2.0 Flash（高速）</option>
						</select>
					</div>
				</div>

				<!-- 参考画像アップロード -->
				<div>
					<label style="font-size: 12px; opacity: 0.9; display: block; margin-bottom: 4px;">参考画像（任意）</label>
					<div style="display: flex; gap: 10px; align-items: center;">
						<input type="file" id="lw-ai-reference-image" accept="image/*" style="display: none;">
						<button type="button" id="lw-ai-upload-btn" class="button" style="background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.3);">
							<span class="dashicons dashicons-upload" style="vertical-align: middle; margin-right: 5px;"></span>
							画像を選択
						</button>
						<span id="lw-ai-image-name" style="font-size: 12px; opacity: 0.8;"></span>
						<button type="button" id="lw-ai-clear-image" style="display: none; background: transparent; border: none; color: #fff; cursor: pointer; font-size: 16px;" title="画像をクリア">×</button>
					</div>
					<div id="lw-ai-image-preview" style="display: none; margin-top: 10px;">
						<img id="lw-ai-preview-img" src="" style="max-width: 200px; max-height: 150px; border-radius: 4px; border: 2px solid rgba(255,255,255,0.3);">
					</div>
					<p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.7;">参考にしたいデザインの画像をアップロードすると、AIがそれを参考にコードを生成します。</p>
				</div>

				<div>
					<label style="font-size: 12px; opacity: 0.9; display: block; margin-bottom: 4px;">どんなパーツを作りたいですか？</label>
					<textarea id="lw-ai-prompt" rows="3" placeholder="例：シンプルなファーストビュー。背景はグラデーション、中央にタイトルとサブタイトル、下にボタン2つ。" style="width: 100%; padding: 12px; border: none; border-radius: 4px; font-size: 14px; resize: vertical;"></textarea>
				</div>

				<!-- AI画像生成オプション -->
				<div style="margin-bottom: 5px;">
					<label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
						<input type="checkbox" id="lw-ai-generate-images" style="width: 16px; height: 16px; margin: 0;">
						<span style="font-size: 13px;">画像をAIで生成する</span>
						<span style="font-size: 11px; opacity: 0.7;">（サンプル画像の代わりにAI生成画像を使用）</span>
					</label>
				</div>

				<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
					<div style="display: flex; align-items: center; gap: 10px;">
						<button type="button" id="lw-ai-generate-btn" class="button button-large" style="background: #fff; color: #667eea; border: none; font-weight: bold; padding: 10px 30px;">
							<span class="lw-ai-btn-text">AIで生成</span>
							<span class="lw-ai-btn-loading" style="display: none;">
								<span class="spinner is-active" style="float: none; margin: 0 5px 0 0;"></span>
								生成中...
							</span>
						</button>
						<button type="button" id="lw-ai-reset-btn" class="button" style="background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 10px 15px; display: none;">
							<span class="dashicons dashicons-trash" style="font-size: 16px; vertical-align: middle; margin-right: 3px;"></span>
							リセット
						</button>
						<span id="lw-ai-mode-indicator" style="display: none; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 4px; font-size: 12px;">
							<span class="dashicons dashicons-edit" style="font-size: 14px; vertical-align: middle;"></span>
							修正モード
						</span>
					</div>
					<span id="lw-ai-generate-status" style="font-size: 12px; opacity: 0.9;"></span>
				</div>
				<p id="lw-ai-mode-hint" style="margin: 10px 0 0 0; font-size: 11px; opacity: 0.7; display: none;">
					既存のコードがあります。「ここを青色に変更して」「ボタンを追加して」など、修正指示を入力してください。
				</p>
			</div>
			<?php endif; ?>
		</div>

		<!-- レイアウト切り替えボタン -->
		<div style="margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px;">
			<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
				<strong style="font-size: 14px;">📐 レイアウト</strong>
				<div style="display: flex; align-items: center; gap: 10px;">
					<span id="lw-layout-status" style="font-size: 12px; color: #666; font-weight: bold;"></span>
					<button type="button" id="lw-theme-toggle" class="button" style="padding: 5px 12px;" title="ダークモード切り替え">
						<span id="lw-theme-icon">🌙</span> <span id="lw-theme-text">ダーク</span>
					</button>
				</div>
			</div>

			<div style="display: flex; gap: 8px; flex-wrap: wrap;">
				<!-- 基本レイアウト -->
				<button type="button" id="lw-layout-vertical" class="button" style="padding: 5px 12px;" title="HTMLとCSSとJSを縦に並べる">
					<span style="font-size: 14px;">⬇️</span> 縦並び
				</button>
				<button type="button" id="lw-layout-horizontal" class="button" style="padding: 5px 12px;" title="HTMLとCSSとJSを横に並べる">
					<span style="font-size: 14px;">↔️</span> 横並び
				</button>

				<span style="border-left: 2px solid #ccc; margin: 0 5px;"></span>

				<!-- 表示切り替え -->
				<button type="button" id="lw-layout-html-only" class="button" style="padding: 5px 12px;" title="HTMLエディタのみ表示">
					<span style="font-size: 14px;">📝</span> HTMLのみ
				</button>
				<button type="button" id="lw-layout-css-only" class="button" style="padding: 5px 12px;" title="CSSエディタのみ表示">
					<span style="font-size: 14px;">🎨</span> CSSのみ
				</button>
				<button type="button" id="lw-layout-js-only" class="button" style="padding: 5px 12px;" title="JavaScriptエディタのみ表示">
					<span style="font-size: 14px;">⚡</span> JSのみ
				</button>

				<span style="border-left: 2px solid #ccc; margin: 0 5px;"></span>

				<!-- 順序入れ替え -->
				<button type="button" id="lw-layout-reverse" class="button" style="padding: 5px 12px;" title="エディタの順序を入れ替える">
					<span style="font-size: 14px;">🔄</span> 順序入れ替え
				</button>
			</div>
		</div>

		<!-- エディタエリア -->
		<div id="lw-editors-wrapper" style="display: flex; flex-direction: column; gap: 20px;">
			<div id="lw-html-editor-wrapper" style="flex: 1; overflow-x: scroll;">
				<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
					<label for="lw_custom_html" style="font-weight: bold; margin: 0;">
						📝 HTML コード　　※注意：絵文字は利用できません。
					</label>
					<button type="button" id="lw-copy-html" class="button button-small" style="padding: 3px 10px; font-size: 12px;">
						📋 コピー
					</button>
				</div>
				<textarea 
					id="lw_custom_html" 
					name="lw_custom_html" 
					rows="15" 
					style="width:100%; font-family: monospace; font-size: 14px;"
				><?php echo esc_textarea( $custom_html ); ?></textarea>
			</div>
			
			<div id="lw-css-editor-wrapper" style="flex: 1; overflow-x: scroll;">
				<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
					<label for="lw_custom_css" style="font-weight: bold; margin: 0;">
						🎨 CSS コード
					</label>
					<button type="button" id="lw-copy-css" class="button button-small" style="padding: 3px 10px; font-size: 12px;">
						📋 コピー
					</button>
				</div>
				<textarea 
					id="lw_custom_css" 
					name="lw_custom_css" 
					rows="15" 
					style="width:100%; font-family: monospace; font-size: 14px;"
				><?php echo esc_textarea( $custom_css ); ?></textarea>
			</div>
			
			<div id="lw-js-editor-wrapper" style="flex: 1; overflow-x: scroll;">
				<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
					<label for="lw_custom_js" style="font-weight: bold; margin: 0;">
						⚡ JavaScript コード
					</label>
					<button type="button" id="lw-copy-js" class="button button-small" style="padding: 3px 10px; font-size: 12px;">
						📋 コピー
					</button>
				</div>
				<textarea 
					id="lw_custom_js" 
					name="lw_custom_js" 
					rows="15" 
					style="width:100%; font-family: monospace; font-size: 14px;"
				><?php echo esc_textarea( $custom_js ); ?></textarea>
			</div>
		</div>
		
		<div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-left: 3px solid #ffc107;">
			<strong>⚠️ 注意</strong><br>
			<ul style="margin: 8px 0 0 20px; font-size: 13px;">
				<li>コードエディタモードでは、通常エディタの内容は使用されません</li>
				<li>HTML、CSS、JavaScriptが直接出力されます</li>
				<li>スタイルは &lt;style&gt; タグ、JavaScriptは &lt;script&gt; タグで自動的に囲まれます</li>
			</ul>
		</div>
	</div>
	
	<?php if ( 'code' !== $editor_mode ) : ?>
	<div id="lw-code-mode-notice" style="padding: 15px; background: #f0f6fc; border-left: 3px solid #0073aa;">
		<strong>💡 コードエディタを使用するには</strong><br>
		右サイドバーの「編集モード」で「コードエディタ」を選択してください。自動保存されます。
	</div>
	<?php endif; ?>
	
	<script>
	jQuery(document).ready(function($) {
		// ★ デバッグモード（本番ではfalseにする）
		var LW_DEBUG = false;
		function debugLog() {
			if (LW_DEBUG && console && console.log) {
				console.log.apply(console, arguments);
			}
		}

		var htmlEditorInstance = null;
		var cssEditorInstance = null;
		var jsEditorInstance = null;
		var isAutoSaving = false;
		
		// ★ レイアウト設定を読み込み
		var currentLayout = localStorage.getItem('lw_code_editor_layout') || 'vertical';
		var isReversed = localStorage.getItem('lw_code_editor_reversed') === 'true';
		var isDarkMode = localStorage.getItem('lw_code_editor_dark_mode') === 'true';
		
		// ★ ダークモード切り替え関数
		function setTheme(dark) {
			isDarkMode = dark;
			
			if (dark) {
				// ダークモード
				$('#lw-theme-icon').text('☀️');
				$('#lw-theme-text').text('ライト');
				$('#lw-theme-toggle').addClass('button-primary');
				
				if (htmlEditorInstance) {
					htmlEditorInstance.setOption('theme', 'material-darker');
					setTimeout(function() {
						htmlEditorInstance.refresh();
					}, 50);
				}
				if (cssEditorInstance) {
					cssEditorInstance.setOption('theme', 'material-darker');
					setTimeout(function() {
						cssEditorInstance.refresh();
					}, 50);
				}
				// ★ JSエディタのテーマ変更を追加
				if (jsEditorInstance) {
					jsEditorInstance.setOption('theme', 'material-darker');
					setTimeout(function() {
						jsEditorInstance.refresh();
					}, 50);
				}
			} else {
				// ライトモード
				$('#lw-theme-icon').text('🌙');
				$('#lw-theme-text').text('ダーク');
				$('#lw-theme-toggle').removeClass('button-primary');
				
				if (htmlEditorInstance) {
					htmlEditorInstance.setOption('theme', 'default');
					setTimeout(function() {
						htmlEditorInstance.refresh();
					}, 50);
				}
				if (cssEditorInstance) {
					cssEditorInstance.setOption('theme', 'default');
					setTimeout(function() {
						cssEditorInstance.refresh();
					}, 50);
				}
				// ★ JSエディタのテーマ変更を追加
				if (jsEditorInstance) {
					jsEditorInstance.setOption('theme', 'default');
					setTimeout(function() {
						jsEditorInstance.refresh();
					}, 50);
				}
			}
			
			localStorage.setItem('lw_code_editor_dark_mode', dark ? 'true' : 'false');
		}
		
		// ★ レイアウト切り替え関数
		function setLayout(layout, reversed) {
			var $wrapper = $('#lw-editors-wrapper');
			var $htmlWrapper = $('#lw-html-editor-wrapper');
			var $cssWrapper = $('#lw-css-editor-wrapper');
			var $jsWrapper = $('#lw-js-editor-wrapper'); // ★ JS追加
			
			// すべてのボタンからbutton-primaryを削除
			$('.button[id^="lw-layout-"]').removeClass('button-primary');
			
			// 表示リセット
			$htmlWrapper.show();
			$cssWrapper.show();
			$jsWrapper.show(); // ★ JS追加
			
			// レイアウト適用
			if (layout === 'html-only') {
				// HTMLのみ表示
				$wrapper.css({
					'flex-direction': 'column',
					'gap': '20px'
				});
				$cssWrapper.hide();
				$jsWrapper.hide(); // ★ JS追加
				$htmlWrapper.css('flex', '1');
				
				$('#lw-layout-html-only').addClass('button-primary');
				$('#lw-layout-status').text('📝 HTMLエディタのみ表示');
				
			} else if (layout === 'css-only') {
				// CSSのみ表示
				$wrapper.css({
					'flex-direction': 'column',
					'gap': '20px'
				});
				$htmlWrapper.hide();
				$jsWrapper.hide(); // ★ JS追加
				$cssWrapper.css('flex', '1');
				
				$('#lw-layout-css-only').addClass('button-primary');
				$('#lw-layout-status').text('🎨 CSSエディタのみ表示');
				
			} else if (layout === 'js-only') {
				// ★ JSのみ表示を追加
				$wrapper.css({
					'flex-direction': 'column',
					'gap': '20px'
				});
				$htmlWrapper.hide();
				$cssWrapper.hide();
				$jsWrapper.css('flex', '1');
				
				$('#lw-layout-js-only').addClass('button-primary');
				$('#lw-layout-status').text('⚡ JavaScriptエディタのみ表示');
				
			} else if (layout === 'horizontal') {
				// 横並び
				$wrapper.css({
					'flex-direction': 'row',
					'gap': '20px'
				});
				$htmlWrapper.css('flex', '1');
				$cssWrapper.css('flex', '1');
				$jsWrapper.css('flex', '1'); // ★ JS追加
				
				$('#lw-layout-horizontal').addClass('button-primary');
				$('#lw-layout-status').text('↔️ 横並びモード');
				
			} else {
				// 縦並び（デフォルト）
				$wrapper.css({
					'flex-direction': 'column',
					'gap': '20px'
				});
				$htmlWrapper.css('flex', '1');
				$cssWrapper.css('flex', '1');
				$jsWrapper.css('flex', '1'); // ★ JS追加
				
				$('#lw-layout-vertical').addClass('button-primary');
				$('#lw-layout-status').text('⬇️ 縦並びモード');
			}
			
			// ★ 順序入れ替え（HTML -> CSS -> JS の順番を変更）
			if (reversed) {
				$wrapper.prepend($jsWrapper);
				$wrapper.prepend($cssWrapper);
				$wrapper.prepend($htmlWrapper);
				$('#lw-layout-reverse').addClass('button-primary');
			} else {
				$wrapper.prepend($jsWrapper);
				$wrapper.prepend($cssWrapper);
				$wrapper.prepend($htmlWrapper);
				$('#lw-layout-reverse').removeClass('button-primary');
			}
			
			// ★ CodeMirrorのリフレッシュ（JS追加）
			setTimeout(function() {
				if (htmlEditorInstance && $htmlWrapper.is(':visible')) {
					htmlEditorInstance.refresh();
				}
				if (cssEditorInstance && $cssWrapper.is(':visible')) {
					cssEditorInstance.refresh();
				}
				if (jsEditorInstance && $jsWrapper.is(':visible')) {
					jsEditorInstance.refresh();
				}
			}, 100);
			
			// 設定を保存
			localStorage.setItem('lw_code_editor_layout', layout);
			localStorage.setItem('lw_code_editor_reversed', reversed ? 'true' : 'false');
			currentLayout = layout;
			isReversed = reversed;
		}
		
		// ★ 初期レイアウトを適用
		setLayout(currentLayout, isReversed);
		
		// ★ コピーボタンの機能
		function copyToClipboard(text, buttonId) {
			if (!text) {
				alert('コピーする内容がありません');
				return;
			}
			
			// クリップボードにコピー
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(text).then(function() {
					// 成功時のフィードバック
					var $button = $(buttonId);
					var originalText = $button.text();
					$button.text('✅ コピーしました!')
						.css('background', '#46b450')
						.css('color', '#fff')
						.css('border-color', '#46b450');
					
					setTimeout(function() {
						$button.text(originalText)
							.css('background', '')
							.css('color', '')
							.css('border-color', '');
					}, 2000);
				}).catch(function(err) {
					alert('コピーに失敗しました: ' + err);
				});
			} else {
				// フォールバック（古いブラウザ対応）
				var $temp = $('<textarea>');
				$('body').append($temp);
				$temp.val(text).select();
				document.execCommand('copy');
				$temp.remove();
				
				var $button = $(buttonId);
				var originalText = $button.text();
				$button.text('✅ コピーしました!')
					.css('background', '#46b450')
					.css('color', '#fff')
					.css('border-color', '#46b450');
				
				setTimeout(function() {
					$button.text(originalText)
						.css('background', '')
						.css('color', '')
						.css('border-color', '');
				}, 2000);
			}
		}
		
		// HTMLコピーボタン
		$('#lw-copy-html').on('click', function(e) {
			e.preventDefault();
			var content = '';
			if (htmlEditorInstance) {
				content = htmlEditorInstance.getValue();
			} else {
				content = $('#lw_custom_html').val();
			}
			copyToClipboard(content, '#lw-copy-html');
		});
		
		// CSSコピーボタン
		$('#lw-copy-css').on('click', function(e) {
			e.preventDefault();
			var content = '';
			if (cssEditorInstance) {
				content = cssEditorInstance.getValue();
			} else {
				content = $('#lw_custom_css').val();
			}
			copyToClipboard(content, '#lw-copy-css');
		});
		
		// ★ JSコピーボタンを追加
		$('#lw-copy-js').on('click', function(e) {
			e.preventDefault();
			var content = '';
			if (jsEditorInstance) {
				content = jsEditorInstance.getValue();
			} else {
				content = $('#lw_custom_js').val();
			}
			copyToClipboard(content, '#lw-copy-js');
		});
		
		// ★ レイアウト切り替えボタン
		$('#lw-layout-vertical').on('click', function(e) {
			e.preventDefault();
			setLayout('vertical', isReversed);
		});
		
		$('#lw-layout-horizontal').on('click', function(e) {
			e.preventDefault();
			setLayout('horizontal', isReversed);
		});
		
		$('#lw-layout-html-only').on('click', function(e) {
			e.preventDefault();
			setLayout('html-only', false);
		});
		
		$('#lw-layout-css-only').on('click', function(e) {
			e.preventDefault();
			setLayout('css-only', false);
		});
		
		// ★ JSのみボタンを追加
		$('#lw-layout-js-only').on('click', function(e) {
			e.preventDefault();
			setLayout('js-only', false);
		});
		
		$('#lw-layout-reverse').on('click', function(e) {
			e.preventDefault();
			setLayout(currentLayout, !isReversed);
		});
		
		// ★ ダークモード切り替えボタン
		$('#lw-theme-toggle').on('click', function(e) {
			e.preventDefault();
			var newDarkMode = !isDarkMode;
			
			// デバッグ用（オプション）
			debugLog('Theme toggle clicked. Current:', isDarkMode, 'New:', newDarkMode);
			debugLog('HTML instance:', htmlEditorInstance ? 'exists' : 'null');
			debugLog('CSS instance:', cssEditorInstance ? 'exists' : 'null');
			debugLog('JS instance:', jsEditorInstance ? 'exists' : 'null');
			
			setTheme(newDarkMode);
		});
		
		// ★ エディタモード切り替え時の自動保存＆リロード
		$('input[name="lw_editor_mode"]').on('change', function() {
			if (isAutoSaving) return;
			
			var newMode = $(this).val();
			var currentMode = '<?php echo esc_js( $editor_mode ); ?>';
			
			if (newMode === currentMode) return;
			
			isAutoSaving = true;
			
			// 保存インジケーター表示
			$('#lw-saving-indicator').fadeIn();
			
			// CodeMirrorの内容を保存
			if (htmlEditorInstance) htmlEditorInstance.save();
			if (cssEditorInstance) cssEditorInstance.save();
			if (jsEditorInstance) jsEditorInstance.save(); // ★ JS追加
			
			// Ajax保存
			$.ajax({
				url: ajaxurl,
				type: 'POST',
				data: {
					action: 'lw_save_editor_mode',
					post_id: <?php echo $post->ID; ?>,
					editor_mode: newMode,
					full_width: $('#lw_full_width_toggle').is(':checked') ? 'on' : '',
					nonce: '<?php echo wp_create_nonce( 'lw_auto_save_editor_mode' ); ?>'
				},
				success: function(response) {
					if (response.success) {
						// 保存成功 → リロード
						window.location.reload();
					} else {
						alert('保存に失敗しました: ' + (response.data || '不明なエラー'));
						$('#lw-saving-indicator').fadeOut();
						isAutoSaving = false;
					}
				},
				error: function() {
					alert('通信エラーが発生しました。');
					$('#lw-saving-indicator').fadeOut();
					isAutoSaving = false;
				}
			});
		});
		
		// ★ 全幅表示切り替え時の自動保存（リロードなし）
		$('#lw_full_width_toggle').on('change', function() {
			var fullWidth = $(this).is(':checked') ? 'on' : '';
			
			$.ajax({
				url: ajaxurl,
				type: 'POST',
				data: {
					action: 'lw_save_full_width',
					post_id: <?php echo $post->ID; ?>,
					full_width: fullWidth,
					nonce: '<?php echo wp_create_nonce( 'lw_auto_save_full_width' ); ?>'
				},
				success: function(response) {
					if (response.success) {
						// 保存成功の通知（オプション）
						debugLog('全幅設定を保存しました');
					}
				}
			});
		});
		
		// CodeMirrorの初期化
		if (typeof wp.codeEditor !== 'undefined' && $('#lw_custom_html').length) {
			var htmlSettings = wp.codeEditor.defaultSettings ? _.clone(wp.codeEditor.defaultSettings) : {};
			htmlSettings.codemirror = _.extend(
				{},
				htmlSettings.codemirror,
				{
					mode: 'htmlmixed',
					lineNumbers: true,
					lineWrapping: false,  // ★ 折り返しをOFF（横スクロール）
					indentUnit: 2,
					tabSize: 2,
					theme: isDarkMode ? 'material-darker' : 'default',  // ★ テーマ適用
					inputStyle: 'textarea',  // ★★ 日本語入力（IME）対応
					autoCloseTags: true,
					autoCloseBrackets: true,
					matchBrackets: true,
					styleActiveLine: true,
					lint: false,  // ★ リント（構文チェック）を無効化
					gutters: ['CodeMirror-linenumbers']  // ★ ガターはライン番号のみ
				}
			);
			
			var htmlEditor = wp.codeEditor.initialize($('#lw_custom_html'), htmlSettings);
			if (htmlEditor && htmlEditor.codemirror) {
				htmlEditorInstance = htmlEditor.codemirror;
			}
			
			var cssSettings = wp.codeEditor.defaultSettings ? _.clone(wp.codeEditor.defaultSettings) : {};
			cssSettings.codemirror = _.extend(
				{},
				cssSettings.codemirror,
				{
					mode: 'css',
					lineNumbers: true,
					lineWrapping: false,  // ★ 折り返しをOFF（横スクロール）
					indentUnit: 2,
					tabSize: 2,
					theme: isDarkMode ? 'material-darker' : 'default',  // ★ テーマ適用
					inputStyle: 'textarea',  // ★★ 日本語入力（IME）対応
					autoCloseBrackets: true,
					matchBrackets: true,
					styleActiveLine: true,
					lint: false,  // ★ リント（構文チェック）を無効化
					gutters: ['CodeMirror-linenumbers']  // ★ ガターはライン番号のみ
				}
			);
			
			var cssEditor = wp.codeEditor.initialize($('#lw_custom_css'), cssSettings);
			if (cssEditor && cssEditor.codemirror) {
				cssEditorInstance = cssEditor.codemirror;
			}
			
			// ★ JavaScriptエディタの初期化
			var jsSettings = wp.codeEditor.defaultSettings ? _.clone(wp.codeEditor.defaultSettings) : {};
			jsSettings.codemirror = _.extend(
				{},
				jsSettings.codemirror,
				{
					mode: 'javascript',
					lineNumbers: true,
					lineWrapping: false,
					indentUnit: 2,
					tabSize: 2,
					theme: isDarkMode ? 'material-darker' : 'default',
					inputStyle: 'textarea',  // ★★ 日本語入力（IME）対応
					autoCloseBrackets: true,
					matchBrackets: true,
					styleActiveLine: true,
					lint: false,  // ★ リント（構文チェック）を無効化
					gutters: ['CodeMirror-linenumbers']  // ★ ガターはライン番号のみ
				}
			);
			
			var jsEditor = wp.codeEditor.initialize($('#lw_custom_js'), jsSettings);
			if (jsEditor && jsEditor.codemirror) {
				jsEditorInstance = jsEditor.codemirror;
			}
			
			// ★ CodeMirror初期化後にレイアウトとテーマを再適用
			setTimeout(function() {
				setLayout(currentLayout, isReversed);
				// テーマ適用を少し遅らせて確実に反映させる
				setTimeout(function() {
					setTheme(isDarkMode);
				}, 200);
			}, 500);
		}
		
		// ★ 通常の保存時（JS追加）
		$('#post').on('submit', function() {
			if (htmlEditorInstance) {
				htmlEditorInstance.save();
			}
			if (cssEditorInstance) {
				cssEditorInstance.save();
			}
			if (jsEditorInstance) {
				jsEditorInstance.save();
			}
		});
		
		// ★ オートセーブ時（JS追加）
		$(document).on('heartbeat-tick.autosave', function() {
			if (htmlEditorInstance) {
				htmlEditorInstance.save();
			}
			if (cssEditorInstance) {
				cssEditorInstance.save();
			}
			if (jsEditorInstance) {
				jsEditorInstance.save();
			}
		});

		// ★ 画像アップロード機能
		var lw_ai_reference_image_base64 = '';

		$('#lw-ai-upload-btn').on('click', function(e) {
			e.preventDefault();
			$('#lw-ai-reference-image').click();
		});

		$('#lw-ai-reference-image').on('change', function(e) {
			var file = this.files[0];
			if (!file) return;

			// ファイルサイズチェック（5MB以下）
			if (file.size > 5 * 1024 * 1024) {
				alert('画像サイズは5MB以下にしてください。');
				this.value = '';
				return;
			}

			// 画像タイプチェック
			if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
				alert('JPEG、PNG、GIF、WebP形式の画像のみ対応しています。');
				this.value = '';
				return;
			}

			// ファイル名を表示
			$('#lw-ai-image-name').text(file.name);
			$('#lw-ai-clear-image').show();

			// プレビュー表示とBase64変換
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#lw-ai-preview-img').attr('src', e.target.result);
				$('#lw-ai-image-preview').show();
				// Base64データを保存（data:image/xxx;base64, の部分を除去）
				lw_ai_reference_image_base64 = e.target.result.split(',')[1];
			};
			reader.readAsDataURL(file);
		});

		$('#lw-ai-clear-image').on('click', function(e) {
			e.preventDefault();
			$('#lw-ai-reference-image').val('');
			$('#lw-ai-image-name').text('');
			$('#lw-ai-image-preview').hide();
			$('#lw-ai-preview-img').attr('src', '');
			$(this).hide();
			lw_ai_reference_image_base64 = '';
		});

		// ★ 使用中の番号を取得して自動設定
		var lw_used_parts_numbers = {};

		function getNextAvailableNumber(type) {
			var usedNumbers = lw_used_parts_numbers[type] || [];
			var nextNumber = 1;

			// 使用中の番号をスキップして次の番号を見つける
			while (usedNumbers.indexOf(nextNumber) !== -1) {
				nextNumber++;
			}

			return nextNumber;
		}

		function updatePartsNumber() {
			var type = $('#lw-ai-parts-type').val();
			var nextNumber = getNextAvailableNumber(type);
			$('#lw-ai-parts-number').val(nextNumber);
		}

		// ページ読み込み時に使用中の番号を取得
		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: {
				action: 'lw_get_used_parts_numbers'
			},
			success: function(response) {
				if (response.success) {
					lw_used_parts_numbers = response.data;
					updatePartsNumber();
				}
			}
		});

		// パーツタイプ変更時に番号を更新
		$('#lw-ai-parts-type').on('change', function() {
			updatePartsNumber();
		});

		// ★ リセットボタン機能
		$('#lw-ai-reset-btn').on('click', function(e) {
			e.preventDefault();

			if (!confirm('エディタの内容をすべてクリアして、最初からやり直しますか？')) {
				return;
			}

			// エディタをクリア
			if (htmlEditorInstance) {
				htmlEditorInstance.setValue('');
			} else {
				$('#lw_custom_html').val('');
			}

			if (cssEditorInstance) {
				cssEditorInstance.setValue('');
			} else {
				$('#lw_custom_css').val('');
			}

			if (jsEditorInstance) {
				jsEditorInstance.setValue('');
			} else {
				$('#lw_custom_js').val('');
			}

			// プロンプトもクリア
			$('#lw-ai-prompt').val('');
			$('#lw-ai-generate-status').text('リセットしました');

			// 修正モード表示を更新
			updateAiModeIndicator();

			// ステータスを数秒後にクリア
			setTimeout(function() {
				$('#lw-ai-generate-status').text('');
			}, 2000);
		});

		// ★ 修正モード検出と表示更新
		function updateAiModeIndicator() {
			var currentHtml = htmlEditorInstance ? htmlEditorInstance.getValue() : $('#lw_custom_html').val();
			var currentCss = cssEditorInstance ? cssEditorInstance.getValue() : $('#lw_custom_css').val();
			var currentJs = jsEditorInstance ? jsEditorInstance.getValue() : $('#lw_custom_js').val();

			var hasExistingCode = (currentHtml && currentHtml.trim()) ||
			                      (currentCss && currentCss.trim()) ||
			                      (currentJs && currentJs.trim());

			if (hasExistingCode) {
				$('#lw-ai-mode-indicator').show();
				$('#lw-ai-mode-hint').show();
				$('#lw-ai-reset-btn').show();
				$('#lw-ai-prompt').attr('placeholder', '例：背景色を青に変更して、ボタンをもう一つ追加して');
			} else {
				$('#lw-ai-mode-indicator').hide();
				$('#lw-ai-mode-hint').hide();
				$('#lw-ai-reset-btn').hide();
				$('#lw-ai-prompt').attr('placeholder', '例：シンプルなファーストビュー。背景はグラデーション、中央にタイトルとサブタイトル、下にボタン2つ。');
			}

			return hasExistingCode;
		}

		// エディタの内容が変わったら修正モード表示を更新
		setTimeout(function() {
			updateAiModeIndicator();

			if (htmlEditorInstance) {
				htmlEditorInstance.on('change', function() {
					setTimeout(updateAiModeIndicator, 100);
				});
			}
			if (cssEditorInstance) {
				cssEditorInstance.on('change', function() {
					setTimeout(updateAiModeIndicator, 100);
				});
			}
			if (jsEditorInstance) {
				jsEditorInstance.on('change', function() {
					setTimeout(updateAiModeIndicator, 100);
				});
			}
		}, 1000);

		// ★ プレビュー確認用の一時データ保存
		var lw_ai_preview_analysis = null;
		var lw_ai_preview_request_data = null;

		// ★ プレビューダイアログの内容を生成
		function buildPreviewContent(analysis) {
			var html = '';

			debugLog('[LW AI Preview] buildPreviewContent - 入力データ:', JSON.stringify(analysis, null, 2));

			// コンテキスト（API: content_context）
			var context = analysis.content_context || analysis.context || '';
			if (context) {
				html += '<div style="margin-bottom: 20px;">';
				html += '<label style="display: block; font-weight: bold; margin-bottom: 8px; color: #667eea;">サイトの種類・目的</label>';
				html += '<input type="text" id="lw-preview-context" value="' + escapeHtml(context) + '" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">';
				html += '</div>';
			}

			// カラースキーム（API: colors）
			var colors = analysis.colors || analysis.color_scheme || null;
			if (colors) {
				html += '<div style="margin-bottom: 20px;">';
				html += '<label style="display: block; font-weight: bold; margin-bottom: 8px; color: #667eea;">カラースキーム</label>';
				html += '<div style="display: flex; gap: 10px; flex-wrap: wrap;">';

				// 背景色
				if (colors.background) {
					html += '<div style="display: flex; align-items: center; gap: 5px;">';
					html += '<span style="width: 24px; height: 24px; border-radius: 4px; background: ' + colors.background + '; border: 1px solid #ddd;"></span>';
					html += '<input type="text" id="lw-preview-color-background" value="' + escapeHtml(colors.background) + '" style="width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;" placeholder="背景色">';
					html += '</div>';
				}
				// メインテキスト色
				if (colors.text_primary) {
					html += '<div style="display: flex; align-items: center; gap: 5px;">';
					html += '<span style="width: 24px; height: 24px; border-radius: 4px; background: ' + colors.text_primary + '; border: 1px solid #ddd;"></span>';
					html += '<input type="text" id="lw-preview-color-primary" value="' + escapeHtml(colors.text_primary) + '" style="width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;" placeholder="テキスト色">';
					html += '</div>';
				}
				// サブテキスト色
				if (colors.text_secondary) {
					html += '<div style="display: flex; align-items: center; gap: 5px;">';
					html += '<span style="width: 24px; height: 24px; border-radius: 4px; background: ' + colors.text_secondary + '; border: 1px solid #ddd;"></span>';
					html += '<input type="text" id="lw-preview-color-secondary" value="' + escapeHtml(colors.text_secondary) + '" style="width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;" placeholder="サブテキスト">';
					html += '</div>';
				}
				// アクセント色
				if (colors.accent) {
					html += '<div style="display: flex; align-items: center; gap: 5px;">';
					html += '<span style="width: 24px; height: 24px; border-radius: 4px; background: ' + colors.accent + '; border: 1px solid #ddd;"></span>';
					html += '<input type="text" id="lw-preview-color-accent" value="' + escapeHtml(colors.accent) + '" style="width: 100px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;" placeholder="アクセント">';
					html += '</div>';
				}

				html += '</div>';
				html += '</div>';
			}

			// 推奨見出し（API: suggested_content.heading）
			var heading = '';
			if (analysis.suggested_content && analysis.suggested_content.heading) {
				heading = analysis.suggested_content.heading;
			} else if (analysis.suggested_heading) {
				heading = analysis.suggested_heading;
			}
			if (heading) {
				html += '<div style="margin-bottom: 20px;">';
				html += '<label style="display: block; font-weight: bold; margin-bottom: 8px; color: #667eea;">推奨見出し</label>';
				html += '<input type="text" id="lw-preview-heading" value="' + escapeHtml(heading) + '" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">';
				html += '</div>';
			}

			// サブタイトル（API: suggested_content.subheading）
			var subheading = '';
			if (analysis.suggested_content && analysis.suggested_content.subheading) {
				subheading = analysis.suggested_content.subheading;
			} else if (analysis.suggested_subheading) {
				subheading = analysis.suggested_subheading;
			}
			if (subheading) {
				html += '<div style="margin-bottom: 20px;">';
				html += '<label style="display: block; font-weight: bold; margin-bottom: 8px; color: #667eea;">サブタイトル</label>';
				html += '<input type="text" id="lw-preview-subheading" value="' + escapeHtml(subheading) + '" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">';
				html += '</div>';
			}

			// レイアウト構成（API: layout オブジェクト）
			var layoutText = '';
			if (analysis.layout) {
				if (typeof analysis.layout === 'string') {
					layoutText = analysis.layout;
				} else if (analysis.layout.structure) {
					layoutText = analysis.layout.structure;
					if (analysis.layout.type) {
						layoutText = '[' + analysis.layout.type + '] ' + layoutText;
					}
				} else if (analysis.layout.type) {
					layoutText = analysis.layout.type;
				}
			} else if (analysis.layout_structure) {
				layoutText = analysis.layout_structure;
			}
			if (layoutText) {
				html += '<div style="margin-bottom: 20px;">';
				html += '<label style="display: block; font-weight: bold; margin-bottom: 8px; color: #667eea;">レイアウト構成</label>';
				html += '<textarea id="lw-preview-layout" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical;">' + escapeHtml(layoutText) + '</textarea>';
				html += '</div>';
			}

			// UIパターン（API: ui_elements）
			var uiPatterns = analysis.ui_elements || analysis.ui_patterns || [];
			if (uiPatterns && uiPatterns.length > 0) {
				html += '<div style="margin-bottom: 20px;">';
				html += '<label style="display: block; font-weight: bold; margin-bottom: 8px; color: #667eea;">検出されたUIパターン</label>';
				html += '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
				uiPatterns.forEach(function(pattern) {
					html += '<span style="background: #e8f4fd; color: #0073aa; padding: 5px 12px; border-radius: 20px; font-size: 13px;">' + escapeHtml(pattern) + '</span>';
				});
				html += '</div>';
				html += '</div>';
			}

			// 画像の説明（API: image_descriptions）
			var imageDescs = analysis.image_descriptions || [];
			if (imageDescs && imageDescs.length > 0) {
				html += '<div style="margin-bottom: 20px;">';
				html += '<label style="display: block; font-weight: bold; margin-bottom: 8px; color: #667eea;">生成する画像の説明</label>';
				html += '<div id="lw-preview-images-container">';
				imageDescs.forEach(function(desc, index) {
					html += '<div style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">';
					html += '<span style="background: #667eea; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">' + (index + 1) + '</span>';
					html += '<input type="text" class="lw-preview-image-desc" data-index="' + index + '" value="' + escapeHtml(desc) + '" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">';
					html += '</div>';
				});
				html += '</div>';
				html += '</div>';
			}

			// 追加コメント
			html += '<div style="margin-bottom: 10px;">';
			html += '<label style="display: block; font-weight: bold; margin-bottom: 8px; color: #667eea;">追加の指示（任意）</label>';
			html += '<textarea id="lw-preview-additional" rows="2" placeholder="例：ボタンをもっと大きく、背景は少し暗めに" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical;"></textarea>';
			html += '</div>';

			// HTMLが空の場合のフォールバック
			if (!html || html.trim() === '') {
				html = '<div style="padding: 20px; text-align: center; color: #666;">';
				html += '<p>分析データを取得できませんでした。</p>';
				html += '<pre style="text-align: left; font-size: 11px; background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; max-height: 200px;">' + escapeHtml(JSON.stringify(analysis, null, 2)) + '</pre>';
				html += '</div>';
			}

			return html;
		}

		// HTMLエスケープ関数
		function escapeHtml(str) {
			if (!str) return '';
			return String(str)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;');
		}

		// ★ プレビューダイアログから修正された分析データを取得
		function getModifiedAnalysis() {
			var modified = JSON.parse(JSON.stringify(lw_ai_preview_analysis)); // ディープコピー

			// コンテキスト（API形式: content_context）
			var context = $('#lw-preview-context').val();
			if (context) {
				modified.content_context = context;
			}

			// 見出し（API形式: suggested_content.heading）
			var heading = $('#lw-preview-heading').val();
			if (heading) {
				modified.suggested_content = modified.suggested_content || {};
				modified.suggested_content.heading = heading;
			}

			// サブタイトル（API形式: suggested_content.subheading）
			var subheading = $('#lw-preview-subheading').val();
			if (subheading) {
				modified.suggested_content = modified.suggested_content || {};
				modified.suggested_content.subheading = subheading;
			}

			// レイアウト
			var layout = $('#lw-preview-layout').val();
			if (layout) {
				if (typeof modified.layout === 'object') {
					modified.layout.structure = layout;
				} else {
					modified.layout = { structure: layout };
				}
			}

			// カラースキーム（API形式: colors）
			var colorBackground = $('#lw-preview-color-background').val();
			var colorPrimary = $('#lw-preview-color-primary').val();
			var colorSecondary = $('#lw-preview-color-secondary').val();
			var colorAccent = $('#lw-preview-color-accent').val();

			if (colorBackground || colorPrimary || colorSecondary || colorAccent) {
				modified.colors = modified.colors || {};
				if (colorBackground) modified.colors.background = colorBackground;
				if (colorPrimary) modified.colors.text_primary = colorPrimary;
				if (colorSecondary) modified.colors.text_secondary = colorSecondary;
				if (colorAccent) modified.colors.accent = colorAccent;
			}

			// 画像の説明
			var imageDescs = [];
			$('.lw-preview-image-desc').each(function() {
				var val = $(this).val();
				if (val) imageDescs.push(val);
			});
			if (imageDescs.length > 0) {
				modified.image_descriptions = imageDescs;
			}

			// 追加の指示
			var additional = $('#lw-preview-additional').val();
			if (additional) {
				modified.additional_instructions = additional;
			}

			debugLog('[LW AI Preview] getModifiedAnalysis - 出力データ:', JSON.stringify(modified, null, 2));

			return modified;
		}

		// ★ プレビューダイアログを表示
		function showPreviewDialog(analysis) {
			debugLog('[LW AI Preview] showPreviewDialog呼び出し');
			debugLog('[LW AI Preview] analysis data:', analysis);

			lw_ai_preview_analysis = analysis;
			var content = buildPreviewContent(analysis);

			debugLog('[LW AI Preview] 生成されたHTML:', content.substring(0, 200) + '...');

			var $dialog = $('#lw-ai-preview-dialog');
			var $content = $('#lw-ai-preview-content');

			debugLog('[LW AI Preview] ダイアログ要素:', $dialog.length ? '見つかった' : '見つからない');
			debugLog('[LW AI Preview] コンテンツ要素:', $content.length ? '見つかった' : '見つからない');

			$content.html(content);
			$dialog.fadeIn(200);

			debugLog('[LW AI Preview] ダイアログ表示完了');
		}

		// ★ プレビューダイアログを閉じる
		function hidePreviewDialog() {
			$('#lw-ai-preview-dialog').fadeOut(200);
			lw_ai_preview_analysis = null;
		}

		// ★ 本生成を実行
		function executeGeneration(confirmedAnalysis) {
			var $status = $('#lw-ai-generate-status');
			var $confirmBtn = $('#lw-ai-preview-confirm');
			var $confirmText = $confirmBtn.find('.lw-confirm-text');
			var $confirmLoading = $confirmBtn.find('.lw-confirm-loading');

			// ローディング表示
			$confirmBtn.prop('disabled', true);
			$confirmText.hide();
			$confirmLoading.show();
			$status.text('コードを生成しています...');

			// リクエストデータを更新（previewOnlyをfalseに変更）
			var requestData = JSON.parse(JSON.stringify(lw_ai_preview_request_data));
			requestData.previewOnly = false;  // 本生成モードに切り替え
			requestData.confirmedAnalysis = confirmedAnalysis;

			// REST API呼び出し
			$.ajax({
				url: '<?php echo rest_url( 'lw-ai-generator/v1/myparts-generate' ); ?>',
				method: 'POST',
				headers: {
					'X-WP-Nonce': '<?php echo wp_create_nonce( 'wp_rest' ); ?>'
				},
				contentType: 'application/json',
				data: JSON.stringify(requestData),
				success: function(response) {
					if (response.success) {
						// HTMLエディタに反映
						if (response.html) {
							if (htmlEditorInstance) {
								htmlEditorInstance.setValue(response.html);
							} else {
								$('#lw_custom_html').val(response.html);
							}
						}

						// CSSエディタに反映
						if (response.css) {
							if (cssEditorInstance) {
								cssEditorInstance.setValue(response.css);
							} else {
								$('#lw_custom_css').val(response.css);
							}
						}

						// JSエディタに反映
						if (response.js) {
							if (jsEditorInstance) {
								jsEditorInstance.setValue(response.js);
							} else {
								$('#lw_custom_js').val(response.js);
							}
						}

						$status.text(response.message || '生成完了！');
						hidePreviewDialog();

						// エディタをリフレッシュ
						setTimeout(function() {
							if (htmlEditorInstance) htmlEditorInstance.refresh();
							if (cssEditorInstance) cssEditorInstance.refresh();
							if (jsEditorInstance) jsEditorInstance.refresh();
						}, 100);

					} else {
						$status.text('エラー: ' + (response.message || '生成に失敗しました'));
					}
				},
				error: function(xhr, status, error) {
					debugLog('AI生成エラー:', error);
					$status.text('通信エラーが発生しました');
				},
				complete: function() {
					$confirmBtn.prop('disabled', false);
					$confirmText.show();
					$confirmLoading.hide();

					// メインボタンもリセット
					var $btn = $('#lw-ai-generate-btn');
					$btn.prop('disabled', false);
					$btn.find('.lw-ai-btn-text').show();
					$btn.find('.lw-ai-btn-loading').hide();
				}
			});
		}

		// ★ 直接生成を実行（プレビューなし）
		function executeDirectGeneration(requestData) {
			var $btn = $('#lw-ai-generate-btn');
			var $status = $('#lw-ai-generate-status');

			// REST API呼び出し
			$.ajax({
				url: '<?php echo rest_url( 'lw-ai-generator/v1/myparts-generate' ); ?>',
				method: 'POST',
				headers: {
					'X-WP-Nonce': '<?php echo wp_create_nonce( 'wp_rest' ); ?>'
				},
				contentType: 'application/json',
				data: JSON.stringify(requestData),
				success: function(response) {
					if (response.success) {
						// HTMLエディタに反映
						if (response.html) {
							if (htmlEditorInstance) {
								htmlEditorInstance.setValue(response.html);
							} else {
								$('#lw_custom_html').val(response.html);
							}
						}

						// CSSエディタに反映
						if (response.css) {
							if (cssEditorInstance) {
								cssEditorInstance.setValue(response.css);
							} else {
								$('#lw_custom_css').val(response.css);
							}
						}

						// JSエディタに反映
						if (response.js) {
							if (jsEditorInstance) {
								jsEditorInstance.setValue(response.js);
							} else {
								$('#lw_custom_js').val(response.js);
							}
						}

						$status.text(response.message || '生成完了！');

						// エディタをリフレッシュ
						setTimeout(function() {
							if (htmlEditorInstance) htmlEditorInstance.refresh();
							if (cssEditorInstance) cssEditorInstance.refresh();
							if (jsEditorInstance) jsEditorInstance.refresh();
						}, 100);

					} else {
						$status.text('エラー: ' + (response.message || '生成に失敗しました'));
					}
				},
				error: function(xhr, status, error) {
					debugLog('AI生成エラー:', error);
					$status.text('通信エラーが発生しました');
				},
				complete: function() {
					$btn.prop('disabled', false);
					$btn.find('.lw-ai-btn-text').show();
					$btn.find('.lw-ai-btn-loading').hide();
				}
			});
		}

		// ★ プレビューダイアログのイベント
		$('#lw-ai-preview-cancel').on('click', function(e) {
			e.preventDefault();
			hidePreviewDialog();

			// メインボタンもリセット
			var $btn = $('#lw-ai-generate-btn');
			$btn.prop('disabled', false);
			$btn.find('.lw-ai-btn-text').show();
			$btn.find('.lw-ai-btn-loading').hide();
			$('#lw-ai-generate-status').text('');
		});

		$('#lw-ai-preview-confirm').on('click', function(e) {
			e.preventDefault();
			var modifiedAnalysis = getModifiedAnalysis();
			executeGeneration(modifiedAnalysis);
		});

		$('#lw-ai-preview-regenerate').on('click', function(e) {
			e.preventDefault();
			hidePreviewDialog();
			// 再分析を実行
			$('#lw-ai-generate-btn').click();
		});

		// ダイアログ外クリックで閉じる
		$('#lw-ai-preview-dialog').on('click', function(e) {
			if (e.target === this) {
				hidePreviewDialog();

				// メインボタンもリセット
				var $btn = $('#lw-ai-generate-btn');
				$btn.prop('disabled', false);
				$btn.find('.lw-ai-btn-text').show();
				$btn.find('.lw-ai-btn-loading').hide();
				$('#lw-ai-generate-status').text('');
			}
		});

		// ★ AI生成機能（プレビューモード対応）
		$('#lw-ai-generate-btn').on('click', function(e) {
			e.preventDefault();

			var $btn = $(this);
			var $btnText = $btn.find('.lw-ai-btn-text');
			var $btnLoading = $btn.find('.lw-ai-btn-loading');
			var $status = $('#lw-ai-generate-status');

			var prompt = $('#lw-ai-prompt').val().trim();
			var partsType = $('#lw-ai-parts-type').val();
			var partsNumber = parseInt($('#lw-ai-parts-number').val()) || 1;
			var model = $('#lw-ai-model').val();

			if (!prompt) {
				alert('どんなパーツを作りたいか入力してください。');
				$('#lw-ai-prompt').focus();
				return;
			}

			// 既存コードを取得
			var currentHtml = htmlEditorInstance ? htmlEditorInstance.getValue() : $('#lw_custom_html').val();
			var currentCss = cssEditorInstance ? cssEditorInstance.getValue() : $('#lw_custom_css').val();
			var currentJs = jsEditorInstance ? jsEditorInstance.getValue() : $('#lw_custom_js').val();

			// ローディング表示
			$btn.prop('disabled', true);
			$btnText.hide();
			$btnLoading.show();

			var hasExistingCode = (currentHtml && currentHtml.trim()) ||
			                      (currentCss && currentCss.trim()) ||
			                      (currentJs && currentJs.trim());

			// AI画像生成オプション
			var generateImages = $('#lw-ai-generate-images').is(':checked');

			// リクエストデータ準備
			var requestData = {
				prompt: prompt,
				partsType: partsType,
				partsNumber: partsNumber,
				model: model,
				generateImages: generateImages
			};

			// 既存コードがある場合は追加（修正モード）
			if (hasExistingCode) {
				requestData.currentCode = {
					html: currentHtml || '',
					css: currentCss || '',
					js: currentJs || ''
				};
			}

			// 参考画像がある場合は追加
			if (lw_ai_reference_image_base64) {
				requestData.referenceImage = lw_ai_reference_image_base64;
			}

			// ★ 参考画像がある場合はプレビューモードを使用
			if (lw_ai_reference_image_base64 && !hasExistingCode) {
				$status.text('参考画像を分析中...');
				requestData.previewOnly = true;
				lw_ai_preview_request_data = requestData;

				debugLog('[LW AI Preview] プレビューモードでAPI呼び出し開始');

				// プレビューモードでAPI呼び出し
				$.ajax({
					url: '<?php echo rest_url( 'lw-ai-generator/v1/myparts-generate' ); ?>',
					method: 'POST',
					headers: {
						'X-WP-Nonce': '<?php echo wp_create_nonce( 'wp_rest' ); ?>'
					},
					contentType: 'application/json',
					data: JSON.stringify(requestData),
					success: function(response) {
						debugLog('[LW AI Preview] APIレスポンス:', response);
						debugLog('[LW AI Preview] success:', response.success);
						debugLog('[LW AI Preview] preview:', response.preview);
						debugLog('[LW AI Preview] analysis:', response.analysis);

						if (response.success && response.preview && response.analysis) {
							$status.text('分析完了。内容を確認してください。');
							debugLog('[LW AI Preview] ダイアログ表示を試行');
							showPreviewDialog(response.analysis);
						} else {
							debugLog('[LW AI Preview] 条件を満たさない - success:', response.success, 'preview:', response.preview, 'analysis:', !!response.analysis);
							$status.text('エラー: ' + (response.message || '分析に失敗しました'));
							$btn.prop('disabled', false);
							$btnText.show();
							$btnLoading.hide();
						}
					},
					error: function(xhr, status, error) {
						debugLog('[LW AI Preview] AI分析エラー:', error);
						debugLog('[LW AI Preview] XHR:', xhr.responseText);
						$status.text('通信エラーが発生しました');
						$btn.prop('disabled', false);
						$btnText.show();
						$btnLoading.hide();
					}
				});
			} else {
				// ★ 参考画像がない場合は直接生成
				if (hasExistingCode) {
					$status.text('既存コードを修正しています...');
				} else {
					$status.text('AIがコードを生成しています...');
				}

				if (generateImages && !hasExistingCode) {
					$status.text('コードを生成後、画像をAIで生成します...');
				}

				executeDirectGeneration(requestData);
			}
		});

		// Enterキーでも送信できるように
		$('#lw-ai-prompt').on('keydown', function(e) {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				$('#lw-ai-generate-btn').click();
			}
		});
	});
	</script>
	
	<style>
    <?php if ( 'code' === $editor_mode ) : ?>
    /* ★ コードエディタモードの時だけ適用 */
    #lw-insert-block {
        display: none !important;
    }
    <?php endif; ?>
    .css-1n451hs {
        height: auto;
    }
	
	/* ★ CodeMirrorのベーススタイル（シンタックスハイライトを妨げないように調整） */
	.CodeMirror {
		border: 1px solid #ddd !important;
		border-radius: 4px;
		font-size: 14px;
		height: auto;
		min-height: 300px;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
	}
	
	.CodeMirror-scroll{
		min-height: 400px;
		overflow-x: auto !important;  /* ★ 横スクロール有効 */
		overflow-y: auto !important;
	}
	
	/* ★ 横スクロール用の設定 */
	.CodeMirror pre {
		white-space: pre !important;  /* 折り返しなし */
	}
	
	.CodeMirror-hscrollbar {
		display: block !important;  /* 横スクロールバー表示 */
	}
	
	/* 行番号エリア */
	.CodeMirror-gutters {
		border-right: 1px solid #ddd !important;
	}
	
	/* アクティブ行のハイライト */
	.CodeMirror-activeline-background {
		background: rgba(0, 115, 170, 0.1) !important;
	}
	
	/* 選択範囲 */
	.CodeMirror-selected {
		background: rgba(0, 115, 170, 0.2) !important;
	}
	
	/* カーソル */
	.CodeMirror-cursor {
		border-left: 2px solid #000 !important;
	}
	
	/* ★ レイアウト切り替えボタンのスタイル */
	.button[id^="lw-layout-"] {
		transition: all 0.3s ease;
		border: 1px solid #ddd;
		background: #fff;
		font-size: 13px;
	}
	
	.button[id^="lw-layout-"]:hover {
		background: #f0f0f0;
		border-color: #999;
	}
	
	.button[id^="lw-layout-"].button-primary {
		background: #0073aa !important;
		color: #fff !important;
		border-color: #0073aa !important;
	}
	
	.button[id^="lw-layout-"].button-primary:hover {
		background: #005a87 !important;
		border-color: #005a87 !important;
	}
	
	/* ★ コピーボタンのスタイル */
	#lw-copy-html,
	#lw-copy-css,
	#lw-copy-js {
		transition: all 0.3s ease;
		border: 1px solid #0073aa;
		background: #fff;
		color: #0073aa;
		cursor: pointer;
		font-weight: bold;
	}
	
	#lw-copy-html:hover,
	#lw-copy-css:hover,
	#lw-copy-js:hover {
		background: #0073aa;
		color: #fff;
		border-color: #0073aa;
	}
	
	#lw-copy-html:active,
	#lw-copy-css:active,
	#lw-copy-js:active {
		transform: scale(0.95);
	}
	
	/* ★ ダークモード切り替えボタン */
	#lw-theme-toggle {
		transition: all 0.3s ease;
		border: 1px solid #ddd;
		background: #fff;
		font-size: 13px;
	}
	
	#lw-theme-toggle:hover {
		background: #f0f0f0;
		border-color: #999;
	}
	
	#lw-theme-toggle.button-primary {
		background: #0073aa !important;
		color: #fff !important;
		border-color: #0073aa !important;
	}
	
	#lw-theme-toggle.button-primary:hover {
		background: #005a87 !important;
		border-color: #005a87 !important;
	}
	</style>
	<?php
}

/* ==========================================================
 * 4. エディタモード自動保存（AJAX）
 * ======================================================= */
add_action( 'wp_ajax_lw_save_editor_mode', 'lw_save_editor_mode_ajax' );
function lw_save_editor_mode_ajax() {
	// Nonceチェック
	if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'lw_auto_save_editor_mode' ) ) {
		wp_send_json_error( 'Nonce verification failed' );
	}
	
	$post_id = intval( $_POST['post_id'] );
	$editor_mode = sanitize_text_field( $_POST['editor_mode'] );
	$full_width = isset( $_POST['full_width'] ) ? sanitize_text_field( $_POST['full_width'] ) : '';
	
	// 権限チェック
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		wp_send_json_error( '編集権限がありません' );
	}
	
	// エディタモードを保存
	update_post_meta( $post_id, '_lw_editor_mode', $editor_mode );
	
	// 全幅設定を保存
	if ( $full_width === 'on' ) {
		update_post_meta( $post_id, '_lw_full_width', 'on' );
	} else {
		delete_post_meta( $post_id, '_lw_full_width' );
	}
	
	wp_send_json_success( 'エディタモードを保存しました' );
}

/* ==========================================================
 * 5. 全幅表示設定自動保存（AJAX）
 * ======================================================= */
add_action( 'wp_ajax_lw_save_full_width', 'lw_save_full_width_ajax' );
function lw_save_full_width_ajax() {
	// Nonceチェック
	if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'lw_auto_save_full_width' ) ) {
		wp_send_json_error( 'Nonce verification failed' );
	}
	
	$post_id = intval( $_POST['post_id'] );
	$full_width = isset( $_POST['full_width'] ) ? sanitize_text_field( $_POST['full_width'] ) : '';
	
	// 権限チェック
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		wp_send_json_error( '編集権限がありません' );
	}
	
	// 全幅設定を保存
	if ( $full_width === 'on' ) {
		update_post_meta( $post_id, '_lw_full_width', 'on' );
	} else {
		delete_post_meta( $post_id, '_lw_full_width' );
	}
	
	wp_send_json_success( '全幅設定を保存しました' );
}

/* ==========================================================
 * 6. ★ メタデータ保存（HTML + CSS + JavaScript）
 * ======================================================= */
add_action( 'save_post_lw_my_parts', 'lw_save_code_editor_meta', 10, 2 );
function lw_save_code_editor_meta( $post_id, $post ) {
	// 自動保存時はスキップ
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	
	// リビジョンはスキップ
	if ( wp_is_post_revision( $post_id ) ) {
		return;
	}
	
	// 権限チェック
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	
	// エディタモード保存
	if ( isset( $_POST['lw_editor_mode_nonce'] ) && 
	     wp_verify_nonce( $_POST['lw_editor_mode_nonce'], 'lw_save_editor_mode' ) ) {
		
		if ( isset( $_POST['lw_editor_mode'] ) ) {
			$editor_mode = sanitize_text_field( $_POST['lw_editor_mode'] );
			update_post_meta( $post_id, '_lw_editor_mode', $editor_mode );
		}
		
		// 全幅表示設定
		if ( isset( $_POST['lw_full_width'] ) && $_POST['lw_full_width'] === 'on' ) {
			update_post_meta( $post_id, '_lw_full_width', 'on' );
		} else {
			delete_post_meta( $post_id, '_lw_full_width' );
		}
	}
	
	// コードエディタの内容を保存
	if ( isset( $_POST['lw_code_editor_nonce'] ) && 
	     wp_verify_nonce( $_POST['lw_code_editor_nonce'], 'lw_save_code_editor' ) ) {
		
		if ( isset( $_POST['lw_custom_html'] ) ) {
			update_post_meta( $post_id, '_lw_custom_html', wp_unslash( $_POST['lw_custom_html'] ) );
		}
		
		if ( isset( $_POST['lw_custom_css'] ) ) {
			update_post_meta( $post_id, '_lw_custom_css', wp_unslash( $_POST['lw_custom_css'] ) );
		}
		
		// ★ JavaScript保存を追加
		if ( isset( $_POST['lw_custom_js'] ) ) {
			update_post_meta( $post_id, '_lw_custom_js', wp_unslash( $_POST['lw_custom_js'] ) );
		}
	}
}

/* ==========================================================
 * 7. CodeMirror アセット読み込み
 * ======================================================= */
add_action( 'admin_enqueue_scripts', 'lw_enqueue_code_editor_assets' );
function lw_enqueue_code_editor_assets( $hook ) {
	global $post_type;
	
	if ( $post_type !== 'lw_my_parts' || ( $hook !== 'post.php' && $hook !== 'post-new.php' ) ) {
		return;
	}
	
	// ★ WordPressのコードエディタを読み込み（これで必要なファイルはすべて自動で読み込まれる）
	// lint機能を無効化する設定を渡す
	$editor_settings = array(
		'codemirror' => array(
			'lint' => false,
			'gutters' => array( 'CodeMirror-linenumbers' )
		)
	);
	
	wp_enqueue_code_editor( array( 
		'type' => 'text/html',
		'codemirror' => $editor_settings['codemirror']
	) );
	wp_enqueue_code_editor( array( 
		'type' => 'text/css',
		'codemirror' => $editor_settings['codemirror']
	) );
	wp_enqueue_code_editor( array( 
		'type' => 'text/javascript',
		'codemirror' => $editor_settings['codemirror']
	) );
	
	// CodeMirror本体（念のため）
	wp_enqueue_style( 'wp-codemirror' );
	wp_enqueue_script( 'wp-codemirror' );
	
	// ★ ダークモード用のカスタムCSS（インラインで追加）
	wp_add_inline_style( 'wp-codemirror', '
		/* Material Darker テーマのカスタム定義（見やすさ重視） */
		.cm-s-material-darker.CodeMirror {
			background-color: #1e1e1e !important;
			color: #d4d4d4 !important;
			border: 1px solid #333 !important;
		}
		.cm-s-material-darker .CodeMirror-gutters {
			background: #1e1e1e !important;
			color: #858585 !important;
			border-right: 1px solid #333 !important;
		}
		.cm-s-material-darker .CodeMirror-cursor {
			border-left: 2px solid #ffffff !important;
		}
		.cm-s-material-darker .CodeMirror-activeline-background {
			background: rgba(255, 255, 255, 0.08) !important;
		}
		.cm-s-material-darker .CodeMirror-selected {
			background: rgba(38, 79, 120, 0.6) !important;
		}
		.cm-s-material-darker .CodeMirror-linenumber {
			color: #858585 !important;
		}
		.cm-s-material-darker .CodeMirror-scroll {
			background-color: #1e1e1e !important;
		}
		
		/* HTML/XML タグ */
		.cm-s-material-darker .cm-tag {
			color: #569cd6 !important;  /* 明るい青 */
		}
		
		/* HTML属性名 */
		.cm-s-material-darker .cm-attribute {
			color: #9cdcfe !important;  /* 明るいシアン */
		}
		
		/* 文字列 */
		.cm-s-material-darker .cm-string {
			color: #ce9178 !important;  /* オレンジベージュ */
		}
		
		/* キーワード */
		.cm-s-material-darker .cm-keyword {
			color: #c586c0 !important;  /* 明るい紫 */
		}
		
		/* CSSプロパティ名 */
		.cm-s-material-darker .cm-property {
			color: #9cdcfe !important;  /* 明るいシアン */
		}
		
		/* CSS値・カラー */
		.cm-s-material-darker .cm-atom {
			color: #ce9178 !important;  /* オレンジベージュ */
		}
		
		/* 数値 */
		.cm-s-material-darker .cm-number {
			color: #b5cea8 !important;  /* 明るい緑 */
		}
		
		/* コメント */
		.cm-s-material-darker .cm-comment {
			color: #6a9955 !important;  /* 緑がかったグレー */
		}
		
		/* CSSセレクタ・クラス名 */
		.cm-s-material-darker .cm-qualifier {
			color: #d7ba7d !important;  /* ゴールド */
		}
		
		/* メタ情報 */
		.cm-s-material-darker .cm-meta {
			color: #d7ba7d !important;  /* ゴールド */
		}
		
		/* 変数 */
		.cm-s-material-darker .cm-variable {
			color: #9cdcfe !important;  /* 明るいシアン */
		}
		
		/* 関数名・定義 */
		.cm-s-material-darker .cm-def {
			color: #dcdcaa !important;  /* 明るい黄色 */
		}
		
		/* 演算子 */
		.cm-s-material-darker .cm-operator {
			color: #d4d4d4 !important;  /* グレー */
		}
		
		/* ブラケット（括弧） */
		.cm-s-material-darker .cm-bracket {
			color: #d4d4d4 !important;  /* グレー */
		}
		
		/* ID セレクタ */
		.cm-s-material-darker .cm-builtin {
			color: #4ec9b0 !important;  /* ティール */
		}
		
		/* 疑似クラス */
		.cm-s-material-darker .cm-variable-2 {
			color: #4ec9b0 !important;  /* ティール */
		}
		
		/* タイプセレクタ */
		.cm-s-material-darker .cm-type {
			color: #4ec9b0 !important;  /* ティール */
		}
	' );
}

/* ==========================================================
 * 8. 一覧画面でモード表示
 * ======================================================= */
add_filter( 'manage_lw_my_parts_posts_columns', 'lw_add_editor_mode_column' );
function lw_add_editor_mode_column( $columns ) {
	$new_columns = array();
	foreach ( $columns as $key => $value ) {
		$new_columns[ $key ] = $value;
		if ( $key === 'title' ) {
			$new_columns['editor_mode'] = '編集モード';
		}
	}
	return $new_columns;
}

add_action( 'manage_lw_my_parts_posts_custom_column', 'lw_display_editor_mode_column', 10, 2 );
function lw_display_editor_mode_column( $column, $post_id ) {
	if ( $column === 'editor_mode' ) {
		$editor_mode = get_post_meta( $post_id, '_lw_editor_mode', true );
		
		if ( 'code' === $editor_mode ) {
			echo '<span style="background: #0073aa; color: #fff; padding: 3px 8px; border-radius: 3px; font-size: 11px;">💻 コード</span>';
		} else {
			echo '<span style="background: #ddd; color: #333; padding: 3px 8px; border-radius: 3px; font-size: 11px;">✏️ 通常</span>';
		}
	}
}

/* ==========================================================
 * 9. 全幅表示設定保存（AJAX）- レガシー対応
 * ======================================================= */
add_action( 'wp_ajax_lw_save_fullwidth', 'lw_save_fullwidth_ajax' );
function lw_save_fullwidth_ajax() {
	// Nonceチェック
	if ( ! isset( $_POST['nonce'] ) || ! isset( $_POST['post_id'] ) ) {
		wp_send_json_error( 'Invalid request' );
	}
	
	$post_id = intval( $_POST['post_id'] );
	
	if ( ! wp_verify_nonce( $_POST['nonce'], 'lw_save_fullwidth_' . $post_id ) ) {
		wp_send_json_error( 'Nonce verification failed' );
	}
	
	// 権限チェック
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		wp_send_json_error( '編集権限がありません' );
	}
	
	// 全幅設定を保存
	$full_width = isset( $_POST['full_width'] ) ? sanitize_text_field( $_POST['full_width'] ) : 'off';
	
	if ( $full_width === 'on' ) {
		update_post_meta( $post_id, '_lw_full_width', 'on' );
	} else {
		delete_post_meta( $post_id, '_lw_full_width' );
	}
	
	wp_send_json_success( '全幅表示設定を保存しました' );
}

/* ==========================================================
 * 10. 使用中のパーツ番号を取得（AJAX）
 * ======================================================= */
add_action( 'wp_ajax_lw_get_used_parts_numbers', 'lw_get_used_parts_numbers_ajax' );
function lw_get_used_parts_numbers_ajax() {
	// 権限チェック
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_send_json_error( '権限がありません' );
	}

	// 全てのコードモードのマイパーツを取得
	$posts = get_posts( array(
		'post_type'      => 'lw_my_parts',
		'posts_per_page' => -1,
		'post_status'    => array( 'publish', 'draft', 'private' ),
		'meta_query'     => array(
			array(
				'key'   => '_lw_editor_mode',
				'value' => 'code',
			),
		),
	) );

	$used_numbers = array();

	foreach ( $posts as $post ) {
		// HTML/CSSからクラス名を検出
		$html = get_post_meta( $post->ID, '_lw_custom_html', true );
		$css = get_post_meta( $post->ID, '_lw_custom_css', true );

		$content = $html . ' ' . $css;

		// lw_my_parts_xxx_N パターンを検索
		if ( preg_match_all( '/lw_my_parts_([a-z_]+)_(\d+)/', $content, $matches, PREG_SET_ORDER ) ) {
			foreach ( $matches as $match ) {
				$type = $match[1];
				$number = intval( $match[2] );

				if ( ! isset( $used_numbers[ $type ] ) ) {
					$used_numbers[ $type ] = array();
				}

				if ( ! in_array( $number, $used_numbers[ $type ], true ) ) {
					$used_numbers[ $type ][] = $number;
				}
			}
		}

		// lw_my_parts_N パターンも検索（タイプなし）
		if ( preg_match_all( '/lw_my_parts_(\d+)(?![a-z_])/', $content, $matches ) ) {
			if ( ! isset( $used_numbers[''] ) ) {
				$used_numbers[''] = array();
			}
			foreach ( $matches[1] as $num ) {
				$number = intval( $num );
				if ( ! in_array( $number, $used_numbers[''], true ) ) {
					$used_numbers[''][] = $number;
				}
			}
		}
	}

	// 各タイプの番号をソート
	foreach ( $used_numbers as $type => $numbers ) {
		sort( $used_numbers[ $type ] );
	}

	wp_send_json_success( $used_numbers );
}