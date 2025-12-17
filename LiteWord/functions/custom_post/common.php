<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* =============================================================
 * 1) メタボックス登録
 * =========================================================== */
add_action( 'add_meta_boxes', 'Lw_add_common_setting_fields' );
function Lw_add_common_setting_fields() {
	$screens = [ 'post', 'page' ];
	foreach ( $screens as $screen ) {
		add_meta_box(
			'common_setting_page_setting',
			'その他の設定',
			'insert_common_setting_meta_fields',
			$screen
		);
	}
}

/* =============================================================
 * 2) 入力フォーム
 * =========================================================== */
function insert_common_setting_meta_fields( $post ) {
	?>
	<input type="hidden" name="meta_nonce" id="meta_nonce"
	       value="<?php echo wp_create_nonce( 'meta_nonce' ); ?>" />
	<div class="Lw_edit_style reset">
		<?php
		$lw_seo_functions = Lw_theme_mod_set( 'lw_extensions_seo_functions_switch', 'off' );
		if ( $lw_seo_functions === 'on' && defined( 'LW_EXPANSION_BASE' ) && LW_EXPANSION_BASE ) : ?>
			<details open>
				<summary>SEO設定</summary>
				<dl>
					<dt>SEOタイトル</dt>
					<dd><?= Lw_input_text( 'seo_title', '', '検索結果に表示されるタイトル' ); ?></dd>

					<dt>ディスクリプション（説明文）</dt>
					<dd><?= Lw_input_textarea( 'seo_description', '', '検索結果に表示される要約', 3 ); ?></dd>

					<dt>noindex設定</dt>
					<dd><?= Lw_input_select(
							'seo_noindex',
							[
								'noindex' => 'noindex（検索エンジンにインデックスさせない）',
								'follow'  => 'follow（インデックスさせる）',
							],
							''
						); ?></dd>

					<dt>canonical URL</dt>
					<dd><?= Lw_input_text( 'seo_canonical', '', 'https://example.com/page' ); ?></dd>

					<dt>OGP画像</dt>
					<dd><?= Lw_input_media( 'seo_og_image', '', 'OGP画像を選択' ); ?></dd>

					<dt>リダイレクト元（旧 URL）</dt>
					<dd><?= Lw_input_text( 'seo_301_redirect_url', '', 'https://example.com/page' ); ?></dd>

					<?php if ( $post->post_type === 'page' ) : ?>
						<dt>サイトタイトル表示/非表示</dt>
						<dd>
							<?php
							if(defined('LW_HAS_SUBSCRIPTION') && LW_HAS_SUBSCRIPTION === true){
								echo Lw_input_select("page_title_display", [
									"" => "未選択",
									"on" => "サイトタイトルをtitleタグに表示させる",
									"off" => "サイトタイトルをtitleタグに表示させない"
								]);
								echo '<p style="margin-top: 5px; color: #666; font-size: 12px;">※ 未選択の場合はサイト全体の設定が適用されます</p>';
							}else{
								echo '<p class="premium_message"><a href="'.admin_url('index.php?show_premium_popup=1').'" target="_blank">LiteWordプレミアム限定機能</a></p>';
							}
							?>
						</dd>
					<?php endif; ?>
				</dl>
			</details>
		<?php endif; ?>

		<!-- JSON-LDセクションは常に表示 -->
		<details>
			<summary>構造化データ（JSON-LD）</summary>
			<?php
			// プレミアムプランのチェック
			if ( ! (defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true) ) :
				// プレミアムプランでない場合
			?>
				<dl>
					<dt>JSON-LD状態</dt>
					<dd>
						<div style="background: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center;">
							<p style="margin: 0; color: #666; font-size: 14px;">
								JSON-LDの設定は<a href="<?=admin_url('index.php?show_premium_popup=1')?>" target="_blank" style="color: #0073aa; text-decoration: underline;">プレミアムプラン</a>のみ利用可能です。
							</p>
						</div>
					</dd>
				</dl>
			<?php
			else :
				// プレミアムプランの場合
				$seo_noindex = get_post_meta( $post->ID, 'seo_noindex', true );
			?>
				<dl>
					<?php if ( $seo_noindex === 'noindex' ) : ?>
						<dt>JSON-LD状態</dt>
						<dd>
							<div style="background: #fff3cd; padding: 15px; border: 1px solid #ffc107; border-radius: 4px;">
								<p style="margin: 0; color: #856404;">
									⚠️ このページはnoindex設定のため、JSON-LDは出力されません。
								</p>
							</div>
						</dd>
					<?php else : ?>
						<dt>このページで<br>自動生成されるJSON-LD</dt>
						<dd>
							<?php
							// セキュリティ注意文の表示（投稿の場合）
							if ( $post->post_type === 'post' ) :
								$author_id = $post->post_author;
								$display_name = get_the_author_meta( 'display_name', $author_id );
								$login = get_the_author_meta( 'user_login', $author_id );
								
								if ( empty( $display_name ) || $display_name === $login ) :
							?>
								<div style="background: #fff3cd; padding: 10px; border: 1px solid #ffc107; border-radius: 4px; margin-bottom: 10px;">
									<p style="margin: 0; color: #856404; font-size: 13px;">
										🔒 <strong>セキュリティ注意：</strong><br>
										執筆者の情報は、セキュリティの観点から<a href="<?php echo admin_url('profile.php'); ?>" target="_blank" style="color: #0073aa;">ユーザーの表示名</a>をログインID以外に設定すると、表示されます。
									</p>
								</div>
							<?php 
								endif;
							endif;
							
							// JSON-LDを取得して表示
							$json_ld_output = lw_get_json_ld_for_preview( $post );
							
							if ( $json_ld_output ) {
								echo '<div style="background: #f5f5f5; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 400px; overflow-y: auto;">';
								echo '<pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">';
								echo esc_html( $json_ld_output );
								echo '</pre>';
								echo '</div>';
								echo '<p style="margin-top: 10px; color: #666; font-size: 12px;">※ 実際の出力時は&lt;script&gt;タグで囲まれます</p>';
							} else {
								echo '<p style="color: #666;">JSON-LDを生成できませんでした。</p>';
							}
							?>
						</dd>

						<dt>カスタムJSON-LD<br>（追加設定）</dt>
						<dd>
							<p style="margin-bottom: 10px; color: #666; font-size: 12px;">
								このページ独自の構造化データを追加できます。上記の自動生成されるJSON-LDに加えて出力されます。
							</p>
							<?= Lw_input_textarea( 
								'lw_custom_json_ld', 
								'', 
								'例: {"@context": "https://schema.org", "@type": "FAQPage", ...}', 
								8 
							); ?>
							<p style="margin-top: 5px; color: #999; font-size: 11px;">
								※ 有効なJSON形式で入力してください。&lt;script&gt;タグは不要です。
							</p>
						</dd>
					<?php endif; ?>
				</dl>
			<?php endif; ?>
		</details>

		<details>
			<summary>カスタムコード設定</summary>
			<dl>
				<dt>head内に挿入するコード</dt>
				<dd><?= Lw_input_textarea( 'seo_custom_head', '', '<script>や<meta>など', 4 ); ?></dd>

				<dt>footer前に挿入するコード</dt>
				<dd><?= Lw_input_textarea( 'seo_custom_footer', '', '<script>などのトラッキングコード', 4 ); ?></dd>
				
				<dt>このページのCSS</dt>
				<dd><?= Lw_input_textarea('lw_custom_css', '', 'このページのみに適用されるCSS', 40) ?></dd>
			</dl>
		</details>
	</div>
	<?php
}

/* =============================================================
 * 既存のJSON-LD関数を使ってプレビューを生成
 * =========================================================== */
function lw_get_json_ld_for_preview( $preview_post ) {
	// プレミアムプラン以外は何も返さない
	if( ! (defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true) ) {
		return '';
	}
	
	// noindexの場合は何も返さない
	$seo_noindex = get_post_meta( $preview_post->ID, 'seo_noindex', true );
	if ( $seo_noindex === 'noindex' ) {
		return '';
	}
	
	// JSON-LD関数が存在しない場合は何も返さない
	if ( ! function_exists( 'lw_json_dl_single' ) || ! function_exists( 'lw_json_dl_page' ) ) {
		return '';
	}
	
	// グローバル変数をバックアップ
	global $post, $wp_query;
	$original_post = $post;
	$original_wp_query = $wp_query;
	
	// プレビュー用の$postを設定
	$post = $preview_post;
	setup_postdata( $post );
	
	// 出力をバッファリング
	ob_start();
	
	// 条件判定を偽装するための一時的なクエリ設定
	$wp_query = new WP_Query( array(
		'p' => $post->ID,
		'post_type' => $post->post_type,
		'posts_per_page' => 1,
	) );
	
	// 既存の関数を使用してJSON-LDを生成
	if ( $post->post_type === 'post' ) {
		// is_single()を偽装
		$wp_query->is_single = true;
		$wp_query->is_singular = true;
		
		lw_json_dl_single();
		
	} elseif ( $post->post_type === 'page' ) {
		// is_page()を偽装
		$wp_query->is_page = true;
		$wp_query->is_singular = true;
		
		lw_json_dl_page();
	}
	
	$output = ob_get_clean();
	
	// グローバル変数を復元
	$post = $original_post;
	$wp_query = $original_wp_query;
	wp_reset_postdata();
	
	// scriptタグを除去してJSONのみ抽出
	if ( ! empty( $output ) ) {
		preg_match_all('/<script[^>]*>(.*?)<\/script>/s', $output, $matches);
		
		if ( ! empty( $matches[1] ) ) {
			$json_objects = array();
			
			foreach ( $matches[1] as $json_string ) {
				$json = json_decode( $json_string, true );
				if ( $json ) {
					$json_objects[] = json_encode( $json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
				}
			}
			
			// 複数のJSON-LDがある場合は改行で区切る
			return implode( "\n\n", $json_objects );
		}
	}
	
	return '';
}

/* =============================================================
 * 3) 保存処理
 * =========================================================== */
add_action( 'save_post', 'Lw_save_common_setting_meta_fields', 10, 1 );
function Lw_save_common_setting_meta_fields( $post_id ) {

	/* ---------- 基本チェック ---------- */
	if ( ! isset( $_POST['meta_nonce'] ) || ! wp_verify_nonce( $_POST['meta_nonce'], 'meta_nonce' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	/* ---------- フィールド定義 ---------- */
	$plain_fields = [
		'seo_title',
		'seo_description',
		'seo_noindex',
		'seo_canonical',
		'seo_301_redirect_url',
		'seo_og_image',
		'lw_custom_css',
		'page_title_display',
	];
	
	// プレミアムプランの場合のみlw_custom_json_ldを追加
	if ( defined( 'LW_HAS_SUBSCRIPTION' ) && LW_HAS_SUBSCRIPTION === true ) {
		$plain_fields[] = 'lw_custom_json_ld';
	}

	$html_fields = [
		'seo_custom_head',
		'seo_custom_footer',
	];

	/* ---------- テキスト系フィールドを保存 ---------- */
	foreach ( $plain_fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			$value = sanitize_textarea_field( $_POST[ $field ] );
			
			// JSON-LDの場合は妥当性チェック
			if ( $field === 'lw_custom_json_ld' && ! empty( $value ) ) {
				json_decode( $value );
				if ( json_last_error() !== JSON_ERROR_NONE ) {
					// 無効なJSONの場合は保存しない
					continue;
				}
			}
			
			$value === '' ? delete_post_meta( $post_id, $field )
			              : update_post_meta( $post_id, $field, $value );
		}
	}

	/* ---------- HTML 系フィールドを保存 ---------- */
	foreach ( $html_fields as $field ) {
		if ( ! isset( $_POST[ $field ] ) ) {
			delete_post_meta( $post_id, $field );
			continue;
		}

		$raw_value = wp_unslash( $_POST[ $field ] );

		if ( current_user_can( 'unfiltered_html' ) ) {
			$safe_value = $raw_value;
		} else {
			$allowed = wp_kses_allowed_html( 'post' );
			$allowed['script'] = [
				'type'   => true,
				'src'    => true,
				'async'  => true,
				'defer'  => true,
				'charset'=> true,
			];
			$safe_value = wp_kses( $raw_value, $allowed );
		}

		$safe_value === '' ? delete_post_meta( $post_id, $field )
		                   : update_post_meta( $post_id, $field, $safe_value );
	}
}