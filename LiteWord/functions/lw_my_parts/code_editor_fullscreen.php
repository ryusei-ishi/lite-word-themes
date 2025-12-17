<?php
/**
 * コーディング特化モード - 専用エディタ（完全版）
 * 
 * すべての元機能を保持しつつJavaScript対応を追加
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ★ admin_action フックで呼び出される
add_action( 'admin_action_lw_code_editor_fullscreen', 'lw_render_fullscreen_code_editor' );

function lw_render_fullscreen_code_editor() {
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
	if ( ! isset( $_GET['_wpnonce'] ) || ! wp_verify_nonce( $_GET['_wpnonce'], 'lw_fullscreen_editor_' . $post_id ) ) {
		wp_die( 'セキュリティチェックに失敗しました。' );
	}
	
	// 投稿を取得
	$post = get_post( $post_id );
	
	if ( ! $post || $post->post_type !== 'lw_my_parts' ) {
		wp_die( 'マイパーツが見つかりません。' );
	}
	
	// 編集権限チェック
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( 'この投稿を編集する権限がありません。' );
	}
	
	// ★ メタデータ取得（JavaScript追加）
	$custom_html = get_post_meta( $post_id, '_lw_custom_html', true );
	$custom_css = get_post_meta( $post_id, '_lw_custom_css', true );
	$custom_js = get_post_meta( $post_id, '_lw_custom_js', true ); // ★ 追加
	$editor_mode = get_post_meta( $post_id, '_lw_editor_mode', true );
	
	?>
	<!DOCTYPE html>
	<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>コーディング特化モード - <?php echo esc_html( $post->post_title ); ?></title>
		
		<!-- ★ CodeMirror（CDNから直接読み込み） -->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/material-darker.min.css">
		
		<!-- ★ jQuery -->
		<script src="<?php echo includes_url( 'js/jquery/jquery.min.js' ); ?>"></script>
		
		<!-- ★ CodeMirrorスクリプト -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/xml/xml.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/css/css.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/htmlmixed/htmlmixed.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/closetag.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/closebrackets.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/matchbrackets.min.js"></script>
		
		<style>
			/* ★ リセット・基本スタイル */
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
			
			body {
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
				background: #1e1e1e;
				color: #fff;
				overflow: hidden;
			}
			
			/* ★ ヘッダーバー */
			.lw-fullscreen-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px 20px;
				background: #2d2d30;
				border-bottom: 1px solid #3e3e42;
				height: 50px;
				flex-shrink: 0;
			}
			
			.lw-header-left,
			.lw-header-center,
			.lw-header-right {
				display: flex;
				align-items: center;
				gap: 8px;
			}
			
			.lw-header-center {
				flex: 1;
				justify-content: center;
				font-weight: 600;
				font-size: 14px;
			}
			
			.lw-btn {
				padding: 6px 14px;
				background: #0e639c;
				color: #fff;
				border: none;
				border-radius: 4px;
				cursor: pointer;
				font-size: 13px;
				font-weight: 500;
				transition: background 0.2s;
				white-space: nowrap;
			}
			
			.lw-btn:hover {
				background: #1177bb;
			}
			
			.lw-btn:active {
				transform: scale(0.98);
			}
			
			.lw-btn:disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
			
			.lw-btn-secondary {
				background: #3e3e42;
			}
			
			.lw-btn-secondary:hover {
				background: #505050;
			}
			
			.lw-btn-secondary.active {
				background: #0e639c;
			}
			
			.lw-btn-danger {
				background: #c72e0e;
			}
			
			.lw-btn-danger:hover {
				background: #d4350e;
			}
			
			.lw-btn-small {
				padding: 4px 10px;
				font-size: 12px;
			}
			
			
			/* ★ レイアウト切り替えボタン */
			.lw-layout-btn {
				min-width: 32px;
				font-weight: 600;
				transition: all 0.2s;
			}
			
			.lw-layout-btn:hover {
				background: #3e3e42;
				transform: translateY(-1px);
			}
			
			.lw-layout-btn.active {
				background: #0e639c !important;
				color: #fff !important;
				box-shadow: 0 0 8px rgba(14, 99, 156, 0.4);
			}
			/* ★ エディタコンテナ */
			.lw-fullscreen-editor {
				display: flex;
				height: calc(100vh - 50px);
				overflow: hidden;
			}
			
			/* ★ 縦並びレイアウト */
			.lw-fullscreen-editor.vertical {
				flex-direction: column;
			}
			
			/* ★ エディタパネル */
			.lw-editor-panel {
				display: flex;
				flex-direction: column;
				flex: 1;
				min-width: 0;
				min-height: 0;
				overflow: hidden;
			}
			
			/* ★ リサイザー */
			.lw-resizer {
				background: #3e3e42;
				cursor: col-resize;
				width: 6px;
				flex-shrink: 0;
				position: relative;
				transition: background 0.2s;
				z-index: 10;
			}
			
			.lw-resizer:hover {
				background: #007acc;
			}
			
			.lw-resizer::before {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 3px;
				height: 40px;
				background: rgba(255, 255, 255, 0.3);
				border-radius: 2px;
			}
			
			.lw-resizer:hover::before {
				background: rgba(255, 255, 255, 0.5);
			}
			
			.lw-resizer.resizing {
				background: #007acc;
			}
			
			.lw-resizer.resizing::before {
				background: rgba(255, 255, 255, 0.8);
			}
			
			/* 縦並びモードのリサイザー */
			.lw-fullscreen-editor.vertical .lw-resizer {
				width: 100%;
				height: 6px;
				cursor: row-resize;
			}
			
			.lw-fullscreen-editor.vertical .lw-resizer::before {
				width: 40px;
				height: 3px;
			}
			
			.lw-editor-header {
				padding: 8px 15px;
				background: #252526;
				border-bottom: 1px solid #3e3e42;
				font-size: 13px;
				color: #cccccc;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-shrink: 0;
			}
			
			.lw-editor-content {
				flex: 1;
				min-height: 0;
				overflow: hidden;
				position: relative;
			}
			
			/* ★ CodeMirror */
			.CodeMirror {
				height: 100% !important;
				font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
				font-size: 14px !important;
			}
			
			/* ★ ライトモード */
			.cm-s-default.CodeMirror {
				background: #ffffff !important;
				color: #000000 !important;
			}
			
			.cm-s-default .CodeMirror-gutters {
				background: #f3f3f3 !important;
				border-right: 1px solid #ddd !important;
			}
			
			/* ★ ダークモード */
			.cm-s-material-darker.CodeMirror {
				background-color: #1e1e1e !important;
				color: #d4d4d4 !important;
			}
			
			.cm-s-material-darker .CodeMirror-gutters {
				background: #1e1e1e !important;
				color: #858585 !important;
				border-right: 1px solid #333 !important;
			}
			
			.cm-s-material-darker .CodeMirror-linenumber {
				color: #858585 !important;
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
			
			/* シンタックスハイライト - ダークモード */
			.cm-s-material-darker .cm-tag { color: #569cd6 !important; }
			.cm-s-material-darker .cm-attribute { color: #9cdcfe !important; }
			.cm-s-material-darker .cm-string { color: #ce9178 !important; }
			.cm-s-material-darker .cm-keyword { color: #c586c0 !important; }
			.cm-s-material-darker .cm-property { color: #9cdcfe !important; }
			.cm-s-material-darker .cm-atom { color: #ce9178 !important; }
			.cm-s-material-darker .cm-number { color: #b5cea8 !important; }
			.cm-s-material-darker .cm-comment { color: #6a9955 !important; }
			.cm-s-material-darker .cm-qualifier { color: #d7ba7d !important; }
			.cm-s-material-darker .cm-variable { color: #9cdcfe !important; }
			.cm-s-material-darker .cm-def { color: #dcdcaa !important; }
			
			/* ★ 保存通知 */
			.lw-save-notification {
				position: fixed;
				top: 60px;
				right: 20px;
				padding: 12px 20px;
				background: #16825d;
				color: #fff;
				border-radius: 4px;
				font-size: 14px;
				font-weight: 500;
				z-index: 10000;
				box-shadow: 0 2px 8px rgba(0,0,0,0.3);
				display: none;
			}
			
			.lw-save-notification.error {
				background: #c72e0e;
			}
		</style>
	</head>
	<body>
		<!-- ヘッダーバー -->
		<div class="lw-fullscreen-header">
			<div class="lw-header-left">
				<button type="button" id="lw-save-btn" class="lw-btn">
					💾 保存
				</button>
				<button type="button" id="lw-preview-btn" class="lw-btn" style="background: #16825d;">
					👁️ プレビュー
				</button>
				<button type="button" id="lw-fullwidth-toggle" class="lw-btn lw-btn-secondary">
					<span id="lw-fullwidth-icon">📏</span>
					<span id="lw-fullwidth-text">全幅</span>
				</button>
				<button type="button" id="lw-theme-toggle" class="lw-btn lw-btn-secondary">
					<span id="lw-theme-icon">🌙</span>
					<span id="lw-theme-text">ダーク</span>
				</button>
				
				<!-- ★ レイアウト切り替えボタン群 -->
				<div style="display: flex; align-items: center; gap: 5px; margin-left: 10px; padding-left: 10px; border-left: 1px solid #3e3e42;">
					<span style="font-size: 11px; color: #888; margin-right: 5px;">表示:</span>
					<button type="button" class="lw-btn lw-btn-small lw-layout-btn" data-layout="all" title="すべて表示">
						全
					</button>
					<button type="button" class="lw-btn lw-btn-small lw-layout-btn" data-layout="html" title="HTMLのみ">
						H
					</button>
					<button type="button" class="lw-btn lw-btn-small lw-layout-btn" data-layout="css" title="CSSのみ">
						C
					</button>
					<button type="button" class="lw-btn lw-btn-small lw-layout-btn" data-layout="js" title="JavaScriptのみ">
						J
					</button>
					<button type="button" class="lw-btn lw-btn-small lw-layout-btn" data-layout="html-css" title="HTML + CSS">
						HC
					</button>
					<button type="button" class="lw-btn lw-btn-small lw-layout-btn" data-layout="html-js" title="HTML + JS">
						HJ
					</button>
					<button type="button" class="lw-btn lw-btn-small lw-layout-btn" data-layout="css-js" title="CSS + JS">
						CJ
					</button>
				</div>
				
				<!-- ★ フォントサイズ調整 -->
				<div style="display: flex; align-items: center; gap: 5px; margin-left: 10px; padding-left: 10px; border-left: 1px solid #3e3e42;">
					<button type="button" id="lw-fontsize-decrease" class="lw-btn lw-btn-secondary lw-btn-small" title="フォントサイズを小さく">
						A-
					</button>
					<span id="lw-fontsize-display" style="color: #cccccc; font-size: 12px; min-width: 40px; text-align: center;">14px</span>
					<button type="button" id="lw-fontsize-increase" class="lw-btn lw-btn-secondary lw-btn-small" title="フォントサイズを大きく">
						A+
					</button>
				</div>
			</div>
			
			<div class="lw-header-center">
				<?php echo esc_html( $post->post_title ); ?>
			</div>
			
			<div class="lw-header-right">
				<button type="button" id="lw-close-btn" class="lw-btn lw-btn-danger">
					✕ 閉じる
				</button>
			</div>
		</div>
		
		<!-- ★ エディタエリア（3パネル構成） -->
		<div class="lw-fullscreen-editor" id="lw-editor-container">
			<!-- HTMLエディタ -->
			<div class="lw-editor-panel" id="lw-html-panel">
				<div class="lw-editor-header">
					<span>📝 HTML</span>
				</div>
				<div class="lw-editor-content">
					<textarea id="lw-html-editor"><?php 
						$safe_html = esc_textarea( $custom_html );
						$safe_html = str_replace( '</textarea>', '&lt;/textarea&gt;', $safe_html );
						echo $safe_html;
					?></textarea>
				</div>
			</div>
			
			<!-- ★ リサイザー1（HTML-CSS間） -->
			<div class="lw-resizer" id="lw-resizer-1"></div>
			
			<!-- CSSエディタ -->
			<div class="lw-editor-panel" id="lw-css-panel">
				<div class="lw-editor-header">
					<span>🎨 CSS</span>
				</div>
				<div class="lw-editor-content">
					<textarea id="lw-css-editor"><?php 
						$safe_css = esc_textarea( $custom_css );
						$safe_css = str_replace( '</textarea>', '&lt;/textarea&gt;', $safe_css );
						echo $safe_css;
					?></textarea>
				</div>
			</div>
			
			<!-- ★ リサイザー2（CSS-JS間） -->
			<div class="lw-resizer" id="lw-resizer-2"></div>
			
			<!-- ★ JavaScriptエディタ -->
			<div class="lw-editor-panel" id="lw-js-panel">
				<div class="lw-editor-header">
					<span>⚡ JavaScript</span>
				</div>
				<div class="lw-editor-content">
					<textarea id="lw-js-editor"><?php 
						$safe_js = esc_textarea( $custom_js );
						$safe_js = str_replace( '</textarea>', '&lt;/textarea&gt;', $safe_js );
						echo $safe_js;
					?></textarea>
				</div>
			</div>
		</div>
		
		<!-- 保存通知 -->
		<div class="lw-save-notification" id="lw-save-notification"></div>
		
		<script>
		// ★ ajaxurlをグローバルに定義
		var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
		
		jQuery(document).ready(function($) {
			console.log('🚀 コーディング特化モード起動（3パネル版）');
			
			var htmlEditor = null;
			var cssEditor = null;
			var jsEditor = null; // ★ JS追加
			var isDarkMode = localStorage.getItem('lw_fullscreen_dark_mode') === 'true';
			var isHorizontal = localStorage.getItem('lw_fullscreen_layout') === 'horizontal';
			var isFullWidth = localStorage.getItem('lw_fullscreen_fullwidth_<?php echo $post_id; ?>') === 'true';
			var fontSize = parseInt(localStorage.getItem('lw_fullscreen_fontsize')) || 14;
			var previewWindow = null;
			var previewUpdateTimer = null;
			
			// ★ Emmet風のスニペット展開関数（元の機能を保持）
			function expandEmmet(snippet) {
				var emmetMap = {
					'div': { code: '<div></div>', cursorOffset: 5 },
					'span': { code: '<span></span>', cursorOffset: 6 },
					'p': { code: '<p></p>', cursorOffset: 3 },
					'a': { code: '<a href=""></a>', cursorOffset: 9 },
					'img': { code: '<img src="" alt="">', cursorOffset: 10 },
					'h1': { code: '<h1></h1>', cursorOffset: 4 },
					'h2': { code: '<h2></h2>', cursorOffset: 4 },
					'h3': { code: '<h3></h3>', cursorOffset: 4 },
					'ul': { code: '<ul>\n\t<li></li>\n</ul>', cursorOffset: 9 },
					'ol': { code: '<ol>\n\t<li></li>\n</ol>', cursorOffset: 9 },
					'li': { code: '<li></li>', cursorOffset: 4 }
				};
				
				// クラスのみ
				var classOnlyMatch = snippet.match(/^\.([\w\-]+)$/);
				if (classOnlyMatch) {
					var className = classOnlyMatch[1];
					return {
						code: '<div class="' + className + '"></div>',
						cursorOffset: 14 + className.length
					};
				}
				
				// クラス付き
				var classMatch = snippet.match(/^([\w\-]+)\.([\w\-]+)$/);
				if (classMatch) {
					var tagName = classMatch[1];
					var className = classMatch[2];
					return {
						code: '<' + tagName + ' class="' + className + '"></' + tagName + '>',
						cursorOffset: tagName.length + 11 + className.length
					};
				}
				
				// ID付き
				var idMatch = snippet.match(/^([\w\-]+)#([\w\-]+)$/);
				if (idMatch) {
					var tagName = idMatch[1];
					var idName = idMatch[2];
					return {
						code: '<' + tagName + ' id="' + idName + '"></' + tagName + '>',
						cursorOffset: tagName.length + 8 + idName.length
					};
				}
				
				return emmetMap[snippet] || null;
			}
			
			// ★ CodeMirror初期化（HTMLエディタ）
			try {
				var htmlTextarea = document.getElementById('lw-html-editor');
				htmlTextarea.value = htmlTextarea.value.replace(/&lt;\/textarea&gt;/gi, '</textarea>');
				
				htmlEditor = CodeMirror.fromTextArea(htmlTextarea, {
					mode: 'htmlmixed',
					lineNumbers: true,
					lineWrapping: false,
					indentUnit: 2,
					tabSize: 2,
					theme: isDarkMode ? 'material-darker' : 'default',
					autoCloseTags: true,
					autoCloseBrackets: true,
					matchBrackets: true,
					styleActiveLine: true,
					extraKeys: {
						'Tab': function(cm) {
							var cursor = cm.getCursor();
							var line = cm.getLine(cursor.line);
							var textBeforeCursor = line.substring(0, cursor.ch);
							var match = textBeforeCursor.match(/[\w\-\.#\*]+$/);
							
							if (match) {
								var snippet = match[0];
								var expanded = expandEmmet(snippet);
								
								if (expanded) {
									var from = { line: cursor.line, ch: cursor.ch - snippet.length };
									var to = cursor;
									cm.replaceRange(expanded.code, from, to);
									
									if (expanded.cursorOffset) {
										cm.setCursor({
											line: cursor.line,
											ch: cursor.ch - snippet.length + expanded.cursorOffset
										});
									}
									return;
								}
							}
							
							if (cm.somethingSelected()) {
								cm.indentSelection('add');
							} else {
								cm.replaceSelection('\t');
							}
						},
						'Ctrl-Space': 'autocomplete'
					}
				});
				
				htmlEditor.on('change', function() {
					schedulePreviewUpdate();
				});
				
				console.log('✅ HTMLエディタ初期化成功（Emmet有効）');
			} catch(e) {
				console.error('❌ HTMLエディタ初期化エラー:', e);
			}
			
			// ★ CodeMirror初期化（CSSエディタ）
			try {
				var cssTextarea = document.getElementById('lw-css-editor');
				cssTextarea.value = cssTextarea.value.replace(/&lt;\/textarea&gt;/gi, '</textarea>');
				
				cssEditor = CodeMirror.fromTextArea(cssTextarea, {
					mode: 'css',
					lineNumbers: true,
					lineWrapping: false,
					indentUnit: 2,
					tabSize: 2,
					theme: isDarkMode ? 'material-darker' : 'default',
					autoCloseBrackets: true,
					matchBrackets: true,
					styleActiveLine: true
				});
				
				cssEditor.on('change', function() {
					schedulePreviewUpdate();
				});
				
				console.log('✅ CSSエディタ初期化成功');
			} catch(e) {
				console.error('❌ CSSエディタ初期化エラー:', e);
			}
			
			// ★ CodeMirror初期化（JavaScriptエディタ）
			try {
				var jsTextarea = document.getElementById('lw-js-editor');
				jsTextarea.value = jsTextarea.value.replace(/&lt;\/textarea&gt;/gi, '</textarea>');
				
				jsEditor = CodeMirror.fromTextArea(jsTextarea, {
					mode: 'javascript',
					lineNumbers: true,
					lineWrapping: false,
					indentUnit: 2,
					tabSize: 2,
					theme: isDarkMode ? 'material-darker' : 'default',
					autoCloseBrackets: true,
					matchBrackets: true,
					styleActiveLine: true
				});
				
				jsEditor.on('change', function() {
					schedulePreviewUpdate();
				});
				
				console.log('✅ JavaScriptエディタ初期化成功');
			} catch(e) {
				console.error('❌ JavaScriptエディタ初期化エラー:', e);
			}
			
			// ★ プレビュー更新スケジュール
			function schedulePreviewUpdate() {
				if (previewUpdateTimer) {
					clearTimeout(previewUpdateTimer);
				}
				
				previewUpdateTimer = setTimeout(function() {
					if (previewWindow && !previewWindow.closed) {
						updatePreview();
					}
				}, 500);
			}
			
			// ★ プレビュー更新
			function updatePreview() {
				if (!previewWindow || previewWindow.closed) {
					return;
				}
				
				var htmlContent = htmlEditor ? htmlEditor.getValue() : '';
				var cssContent = cssEditor ? cssEditor.getValue() : '';
				var jsContent = jsEditor ? jsEditor.getValue() : ''; // ★ JS追加
				
				previewWindow.postMessage({
					type: 'lw_preview_update',
					html: htmlContent,
					css: cssContent,
					js: jsContent, // ★ JS追加
					fullWidth: isFullWidth
				}, '*');
			}
			
			// ★ プレビューボタン
			$('#lw-preview-btn').on('click', function() {
				var previewUrl = '<?php echo admin_url('admin.php'); ?>?action=lw_code_preview&post_id=<?php echo $post_id; ?>&_wpnonce=<?php echo wp_create_nonce('lw_preview_' . $post_id); ?>';
				
				if (!previewWindow || previewWindow.closed) {
					var width = screen.width * 0.6;
					var height = screen.height * 0.8;
					var left = screen.width - width - 20;
					var top = (screen.height - height) / 2;
					
					previewWindow = window.open(
						previewUrl,
						'lw_preview',
						'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes'
					);
				} else {
					previewWindow.focus();
				}
				
				setTimeout(function() {
					updatePreview();
				}, 1000);
			});
			
			// ★ プレビューウィンドウからの準備完了メッセージ
			window.addEventListener('message', function(event) {
				if (event.data && event.data.type === 'lw_preview_ready') {
					console.log('プレビューウィンドウ準備完了');
					setTimeout(function() {
						updatePreview();
					}, 100);
				}
			});
			
			// ★ テーマ切り替え
			function setTheme(dark) {
				isDarkMode = dark;
				
				var theme = dark ? 'material-darker' : 'default';
				if (htmlEditor) htmlEditor.setOption('theme', theme);
				if (cssEditor) cssEditor.setOption('theme', theme);
				if (jsEditor) jsEditor.setOption('theme', theme); // ★ JS追加
				
				if (dark) {
					$('#lw-theme-icon').text('☀️');
					$('#lw-theme-text').text('ライト');
					$('#lw-theme-toggle').addClass('active');
				} else {
					$('#lw-theme-icon').text('🌙');
					$('#lw-theme-text').text('ダーク');
					$('#lw-theme-toggle').removeClass('active');
				}
				
				localStorage.setItem('lw_fullscreen_dark_mode', dark ? 'true' : 'false');
				
				setTimeout(function() {
					if (htmlEditor) htmlEditor.refresh();
					if (cssEditor) cssEditor.refresh();
					if (jsEditor) jsEditor.refresh(); // ★ JS追加
				}, 50);
			}
			
			// ★ レイアウト切り替え
			function setLayout(horizontal) {
				isHorizontal = horizontal;
				var container = $('#lw-editor-container');
				
				if (horizontal) {
					container.css('flex-direction', 'row');
					container.removeClass('vertical');
					$('#lw-layout-icon').text('⬇️');
					$('#lw-layout-text').text('縦並び');
					$('#lw-layout-toggle').addClass('active');
				} else {
					container.css('flex-direction', 'column');
					container.addClass('vertical');
					$('#lw-layout-icon').text('↔️');
					$('#lw-layout-text').text('横並び');
					$('#lw-layout-toggle').removeClass('active');
				}
				
				localStorage.setItem('lw_fullscreen_layout', horizontal ? 'horizontal' : 'vertical');
				
				setTimeout(function() {
					if (htmlEditor) htmlEditor.refresh();
					if (cssEditor) cssEditor.refresh();
					if (jsEditor) jsEditor.refresh(); // ★ JS追加
				}, 50);
			}
			
			// ★ 全幅表示切り替え
			function setFullWidth(fullWidth) {
				isFullWidth = fullWidth;
				
				if (fullWidth) {
					$('#lw-fullwidth-icon').text('📐');
					$('#lw-fullwidth-text').text('標準幅');
					$('#lw-fullwidth-toggle').addClass('active');
				} else {
					$('#lw-fullwidth-icon').text('📏');
					$('#lw-fullwidth-text').text('全幅');
					$('#lw-fullwidth-toggle').removeClass('active');
				}
				
				localStorage.setItem('lw_fullscreen_fullwidth_<?php echo $post_id; ?>', fullWidth ? 'true' : 'false');
				
				if (previewWindow && !previewWindow.closed) {
					updatePreview();
				}
				
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {
						action: 'lw_save_fullwidth',
						post_id: <?php echo $post_id; ?>,
						full_width: fullWidth ? 'on' : 'off',
						nonce: '<?php echo wp_create_nonce('lw_save_fullwidth_' . $post_id); ?>'
					}
				});
			}
			
			// ★ フォントサイズ変更
			function setFontSize(newSize) {
				if (newSize < 10) newSize = 10;
				if (newSize > 24) newSize = 24;
				
				fontSize = newSize;
				
				var editorStyle = document.createElement('style');
				editorStyle.id = 'lw-editor-fontsize-style';
				
				var existingStyle = document.getElementById('lw-editor-fontsize-style');
				if (existingStyle) {
					existingStyle.remove();
				}
				
				editorStyle.textContent = `
					.CodeMirror {
						font-size: ${fontSize}px !important;
					}
					.CodeMirror-lines {
						line-height: ${fontSize + 6}px !important;
					}
				`;
				document.head.appendChild(editorStyle);
				
				$('#lw-fontsize-display').text(fontSize + 'px');
				
				setTimeout(function() {
					if (htmlEditor) htmlEditor.refresh();
					if (cssEditor) cssEditor.refresh();
					if (jsEditor) jsEditor.refresh(); // ★ JS追加
				}, 50);
				
				localStorage.setItem('lw_fullscreen_fontsize', fontSize.toString());
			}
			
			// ★★ 3パネル対応のリサイザー機能
			var resizer1 = document.getElementById('lw-resizer-1');
			var resizer2 = document.getElementById('lw-resizer-2');
			var htmlPanel = document.getElementById('lw-html-panel');
			var cssPanel = document.getElementById('lw-css-panel');
			var jsPanel = document.getElementById('lw-js-panel');
			var isResizing = false;
			var currentResizer = null;
			var startX = 0;
			var startY = 0;
			var startSizes = [];
			
			// 保存されたサイズを復元
			function restorePanelSizes() {
				var savedSizes = localStorage.getItem('lw_panel_sizes_3panel');
				if (savedSizes) {
					try {
						var sizes = JSON.parse(savedSizes);
						if (sizes.length === 3) {
							if (isHorizontal) {
								htmlPanel.style.flex = '0 0 ' + sizes[0] + '%';
								cssPanel.style.flex = '0 0 ' + sizes[1] + '%';
								jsPanel.style.flex = '0 0 ' + sizes[2] + '%';
							} else {
								htmlPanel.style.flex = '0 0 ' + sizes[0] + '%';
								cssPanel.style.flex = '0 0 ' + sizes[1] + '%';
								jsPanel.style.flex = '0 0 ' + sizes[2] + '%';
							}
							setTimeout(function() {
								if (htmlEditor) htmlEditor.refresh();
								if (cssEditor) cssEditor.refresh();
								if (jsEditor) jsEditor.refresh();
							}, 50);
						}
					} catch(e) {
						console.error('サイズ復元エラー:', e);
					}
				}
			}
			
			// サイズを保存
			function savePanelSizes() {
				var container = document.getElementById('lw-editor-container');
				var totalSize = isHorizontal ? container.offsetWidth : container.offsetHeight;
				var htmlSize = isHorizontal ? htmlPanel.offsetWidth : htmlPanel.offsetHeight;
				var cssSize = isHorizontal ? cssPanel.offsetWidth : cssPanel.offsetHeight;
				var jsSize = isHorizontal ? jsPanel.offsetWidth : jsPanel.offsetHeight;
				
				var sizes = [
					(htmlSize / totalSize * 100).toFixed(2),
					(cssSize / totalSize * 100).toFixed(2),
					(jsSize / totalSize * 100).toFixed(2)
				];
				
				localStorage.setItem('lw_panel_sizes_3panel', JSON.stringify(sizes));
			}
			
			// リサイザー1のイベント
			resizer1.addEventListener('mousedown', function(e) {
				isResizing = true;
				currentResizer = 1;
				startX = e.clientX;
				startY = e.clientY;
				
				if (isHorizontal) {
					startSizes = [htmlPanel.offsetWidth, cssPanel.offsetWidth, jsPanel.offsetWidth];
				} else {
					startSizes = [htmlPanel.offsetHeight, cssPanel.offsetHeight, jsPanel.offsetHeight];
				}
				
				resizer1.classList.add('resizing');
				document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
				document.body.style.userSelect = 'none';
				e.preventDefault();
			});
			
			// リサイザー2のイベント
			resizer2.addEventListener('mousedown', function(e) {
				isResizing = true;
				currentResizer = 2;
				startX = e.clientX;
				startY = e.clientY;
				
				if (isHorizontal) {
					startSizes = [htmlPanel.offsetWidth, cssPanel.offsetWidth, jsPanel.offsetWidth];
				} else {
					startSizes = [htmlPanel.offsetHeight, cssPanel.offsetHeight, jsPanel.offsetHeight];
				}
				
				resizer2.classList.add('resizing');
				document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
				document.body.style.userSelect = 'none';
				e.preventDefault();
			});
			
			// マウス移動
			document.addEventListener('mousemove', function(e) {
				if (!isResizing || !currentResizer) return;
				
				var container = document.getElementById('lw-editor-container');
				var totalSize = isHorizontal ? container.offsetWidth : container.offsetHeight;
				var delta = isHorizontal ? (e.clientX - startX) : (e.clientY - startY);
				
				var minSize = 150;
				
				if (currentResizer === 1) {
					// リサイザー1: HTMLとCSSの境界
					var newHtmlSize = startSizes[0] + delta;
					var newCssSize = startSizes[1] - delta;
					
					if (newHtmlSize < minSize) newHtmlSize = minSize;
					if (newCssSize < minSize) newHtmlSize = startSizes[0] + startSizes[1] - minSize;
					
					newCssSize = startSizes[0] + startSizes[1] - newHtmlSize;
					
					var htmlPercent = (newHtmlSize / totalSize) * 100;
					var cssPercent = (newCssSize / totalSize) * 100;
					var jsPercent = (startSizes[2] / totalSize) * 100;
					
					htmlPanel.style.flex = '0 0 ' + htmlPercent + '%';
					cssPanel.style.flex = '0 0 ' + cssPercent + '%';
					jsPanel.style.flex = '0 0 ' + jsPercent + '%';
				} else if (currentResizer === 2) {
					// リサイザー2: CSSとJSの境界
					var newCssSize = startSizes[1] + delta;
					var newJsSize = startSizes[2] - delta;
					
					if (newCssSize < minSize) newCssSize = minSize;
					if (newJsSize < minSize) newCssSize = startSizes[1] + startSizes[2] - minSize;
					
					newJsSize = startSizes[1] + startSizes[2] - newCssSize;
					
					var htmlPercent = (startSizes[0] / totalSize) * 100;
					var cssPercent = (newCssSize / totalSize) * 100;
					var jsPercent = (newJsSize / totalSize) * 100;
					
					htmlPanel.style.flex = '0 0 ' + htmlPercent + '%';
					cssPanel.style.flex = '0 0 ' + cssPercent + '%';
					jsPanel.style.flex = '0 0 ' + jsPercent + '%';
				}
				
				if (htmlEditor) htmlEditor.refresh();
				if (cssEditor) cssEditor.refresh();
				if (jsEditor) jsEditor.refresh();
				
				e.preventDefault();
			});
			
			// マウスアップ
			document.addEventListener('mouseup', function() {
				if (!isResizing) return;
				
				isResizing = false;
				resizer1.classList.remove('resizing');
				resizer2.classList.remove('resizing');
				document.body.style.cursor = '';
				document.body.style.userSelect = '';
				
				if (currentResizer) {
					savePanelSizes();
					currentResizer = null;
				}
			});
			
			// ★ イベントリスナー
			$('#lw-theme-toggle').on('click', function() {
				setTheme(!isDarkMode);
			});
			
			
			// ★ レイアウト切り替え機能（新）
			var currentViewLayout = localStorage.getItem('lw_fullscreen_view_layout') || 'all';
			
			function applyViewLayout(layout) {
				currentViewLayout = layout;
				localStorage.setItem('lw_fullscreen_view_layout', layout);
				
				var $htmlPanel = $('#lw-html-panel');
				var $cssPanel = $('#lw-css-panel');
				var $jsPanel = $('#lw-js-panel');
				var $resizer1 = $('#lw-resizer-1');
				var $resizer2 = $('#lw-resizer-2');
				
				// すべてのボタンからactiveを削除
				$('.lw-layout-btn').removeClass('active');
				
				// 選択されたボタンにactiveを追加
				$('.lw-layout-btn[data-layout="' + layout + '"]').addClass('active');
				
				// ★ すべてのパネルのスタイルをリセット
				$htmlPanel.css({
					'display': 'none',
					'flex': '',
					'width': '',
					'max-width': ''
				});
				$cssPanel.css({
					'display': 'none',
					'flex': '',
					'width': '',
					'max-width': ''
				});
				$jsPanel.css({
					'display': 'none',
					'flex': '',
					'width': '',
					'max-width': ''
				});
				$resizer1.hide();
				$resizer2.hide();
				
				// レイアウトに応じて表示・スタイル設定
				switch(layout) {
					case 'all':
						// 3つすべて表示
						$htmlPanel.css({
							'display': 'flex',
							'flex': '1'
						});
						$cssPanel.css({
							'display': 'flex',
							'flex': '1'
						});
						$jsPanel.css({
							'display': 'flex',
							'flex': '1'
						});
						$resizer1.show();
						$resizer2.show();
						break;
					case 'html':
						// HTMLのみ - 全幅
						$htmlPanel.css({
							'display': 'flex',
							'flex': '1',
							'width': '100%'
						});
						break;
					case 'css':
						// CSSのみ - 全幅
						$cssPanel.css({
							'display': 'flex',
							'flex': '1',
							'width': '100%'
						});
						break;
					case 'js':
						// JSのみ - 全幅
						$jsPanel.css({
							'display': 'flex',
							'flex': '1',
							'width': '100%'
						});
						break;
					case 'html-css':
						// HTML + CSS
						$htmlPanel.css({
							'display': 'flex',
							'flex': '1'
						});
						$cssPanel.css({
							'display': 'flex',
							'flex': '1'
						});
						$resizer1.show();
						break;
					case 'html-js':
						// HTML + JS
						$htmlPanel.css({
							'display': 'flex',
							'flex': '1'
						});
						$jsPanel.css({
							'display': 'flex',
							'flex': '1'
						});
						$resizer1.show();
						break;
					case 'css-js':
						// CSS + JS
						$cssPanel.css({
							'display': 'flex',
							'flex': '1'
						});
						$jsPanel.css({
							'display': 'flex',
							'flex': '1'
						});
						$resizer2.show();
						break;
				}
				
				// CodeMirrorをリフレッシュ
				setTimeout(function() {
					if (htmlEditor && $htmlPanel.is(':visible')) htmlEditor.refresh();
					if (cssEditor && $cssPanel.is(':visible')) cssEditor.refresh();
					if (jsEditor && $jsPanel.is(':visible')) jsEditor.refresh();
				}, 50);
				
				console.log('📐 レイアウト変更:', layout);
			}
			
			// 初期レイアウトを適用
			applyViewLayout(currentViewLayout);
			
			// レイアウトボタンのクリックイベント
			$('.lw-layout-btn').on('click', function() {
				var layout = $(this).data('layout');
				applyViewLayout(layout);
			});
			
			$('#lw-fullwidth-toggle').on('click', function() {
				setFullWidth(!isFullWidth);
			});
			
			$('#lw-fontsize-increase').on('click', function() {
				setFontSize(fontSize + 2);
			});
			
			$('#lw-fontsize-decrease').on('click', function() {
				setFontSize(fontSize - 2);
			});
			
			// ★ 保存ボタン
			$('#lw-save-btn').on('click', function() {
				var $btn = $(this);
				$btn.prop('disabled', true).text('保存中...');
				
				var htmlContent = htmlEditor ? htmlEditor.getValue() : '';
				var cssContent = cssEditor ? cssEditor.getValue() : '';
				var jsContent = jsEditor ? jsEditor.getValue() : ''; // ★ JS追加
				
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {
						action: 'lw_save_fullscreen_editor',
						post_id: <?php echo $post_id; ?>,
						custom_html: htmlContent,
						custom_css: cssContent,
						custom_js: jsContent, // ★ JS追加
						nonce: '<?php echo wp_create_nonce('lw_save_fullscreen_' . $post_id); ?>'
					},
					success: function(response) {
						if (response.success) {
							showNotification('✅ 保存しました', false);
						} else {
							showNotification('❌ 保存に失敗: ' + (response.data || '不明なエラー'), true);
						}
					},
					error: function(xhr, status, error) {
						showNotification('❌ 通信エラーが発生しました: ' + error, true);
					},
					complete: function() {
						$btn.prop('disabled', false).text('💾 保存');
					}
				});
			});
			
			// 通知表示
			function showNotification(message, isError) {
				var $notification = $('#lw-save-notification');
				$notification.text(message)
					.toggleClass('error', isError)
					.fadeIn(200);
				
				setTimeout(function() {
					$notification.fadeOut(200);
				}, 3000);
			}
			
			// 閉じるボタン
			$('#lw-close-btn').on('click', function() {
				if (confirm('編集内容を保存しましたか?\n保存していない変更は失われます。')) {
					if (previewWindow && !previewWindow.closed) {
						previewWindow.close();
					}
					window.close();
				}
			});
			
			// ショートカットキー
			$(document).on('keydown', function(e) {
				if ((e.ctrlKey || e.metaKey) && e.key === 's') {
					e.preventDefault();
					$('#lw-save-btn').click();
				}
				
				if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
					e.preventDefault();
					$('#lw-preview-btn').click();
				}
			});
			
			// 初期設定を適用
			setTheme(isDarkMode);
			setLayout(isHorizontal);
			setFullWidth(isFullWidth);
			setFontSize(fontSize);
			restorePanelSizes();
			
			console.log('✅ 初期化完了（全機能+JS対応）');
		});
		</script>
	</body>
	</html>
	<?php
	exit;
}

// ★ 保存処理（Ajax）
add_action( 'wp_ajax_lw_save_fullscreen_editor', 'lw_save_fullscreen_editor_ajax' );

function lw_save_fullscreen_editor_ajax() {
	$post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;
	
	if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'lw_save_fullscreen_' . $post_id ) ) {
		wp_send_json_error( 'セキュリティチェックに失敗しました' );
	}
	
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		wp_send_json_error( '編集権限がありません' );
	}
	
	// ★ データ取得（JavaScript追加）
	$custom_html = isset( $_POST['custom_html'] ) ? wp_unslash( $_POST['custom_html'] ) : '';
	$custom_css = isset( $_POST['custom_css'] ) ? wp_unslash( $_POST['custom_css'] ) : '';
	$custom_js = isset( $_POST['custom_js'] ) ? wp_unslash( $_POST['custom_js'] ) : ''; // ★ 追加
	
	// 保存
	update_post_meta( $post_id, '_lw_custom_html', $custom_html );
	update_post_meta( $post_id, '_lw_custom_css', $custom_css );
	update_post_meta( $post_id, '_lw_custom_js', $custom_js ); // ★ 追加
	
	wp_update_post( array(
		'ID' => $post_id,
		'post_content' => ''
	));
	
	wp_send_json_success( '保存しました' );
}