<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* ==============================================================
 * 1) 管理画面（カテゴリー一覧）列カスタマイズ
 * ============================================================= */
if ( is_admin() ) {

	/* ---------- (1) ID 列追加 ---------- */
	function lw_add_category_id_column( $columns ) {
		$columns['category_id'] = 'ID';
		return $columns;
	}
	add_filter( 'manage_edit-category_columns', 'lw_add_category_id_column' );

	function lw_display_category_id_column( $content, $column_name, $term_id ) {
		if ( $column_name === 'category_id' ) {
			$content = $term_id;
		}
		return $content;
	}
	add_filter( 'manage_category_custom_column', 'lw_display_category_id_column', 10, 3 );

	/* ---------- (2) 並び順 列追加 ---------- */
	function lw_add_category_sort_order_column( $columns ) {
		$columns['sort_order'] = '並び順';
		return $columns;
	}
	add_filter( 'manage_edit-category_columns', 'lw_add_category_sort_order_column' );

	function lw_display_category_sort_order_column( $content, $column_name, $term_id ) {
		if ( $column_name === 'sort_order' ) {
			$content = get_term_meta( $term_id, 'category_sort_order', true );
		}
		return $content;
	}
	add_filter( 'manage_category_custom_column', 'lw_display_category_sort_order_column', 10, 3 );

	/* ---------- (3) 列幅調整 CSS ---------- */
	add_action( 'admin_head', function () {
		$screen = get_current_screen();
		if ( $screen && $screen->id === 'edit-category' ) {
			echo '<style>
				.column-category_id { width:40px;  text-align:center; }
				.column-sort_order { width:80px;  text-align:center; }
			</style>';
		}
	} );

	/* ---------- (4) クイック編集フォームに並び順 ---------- */
	add_action( 'quick_edit_custom_box', function ( $column_name, $screen, $taxonomy ) {
		if ( $screen !== 'edit-tags' || $taxonomy !== 'category' || $column_name !== 'sort_order' ) {
			return;
		} ?>
		<fieldset class="inline-edit-col-right">
			<div class="inline-edit-col">
				<label class="inline-edit-sort-order">
					<span class="title">並び順</span>
					<span class="input-text-wrap">
						<input type="number" name="category_sort_order" class="category_sort_order_field" min="0" value="">
					</span>
				</label>
			</div>
		</fieldset>
	<?php }, 10, 3 );

	/* クイック編集に値を渡す JavaScript */
	add_action( 'admin_footer-edit-tags.php', function () {
		if ( isset( $_GET['taxonomy'] ) && $_GET['taxonomy'] === 'category' ) : ?>
<script>
document.addEventListener('click', function (e) {
	if ( ! e.target.classList.contains('editinline') ) return;

	const tr  = e.target.closest('tr');
	if ( ! tr ) return;

	const id  = tr.id.replace('tag-', '');
	const val = ( tr.querySelector('.column-sort_order') || {} ).textContent || '';
	const row = document.getElementById('edit-' + id);
	if ( ! row ) return;

	const inp = row.querySelector('input.category_sort_order_field');
	if ( inp ) inp.value = val.trim();
});
</script>
<?php	endif;
	} );

	/* ==============================================================
	 * 1-B) カテゴリーアイキャッチ画像フィールド
	 * ============================================================== */
	/* 行内スタイル */
	add_action( 'admin_head', function () {
		if ( isset( $_GET['taxonomy'] ) && $_GET['taxonomy'] === 'category' ) {
			echo '<style>
				.category-thumbnail-wrapper{text-align:center;margin-bottom:20px;}
				#category_thumbnail_preview{max-width:150px;margin-bottom:10px;display:block;}
				.category-thumbnail-buttons{display:flex;gap:10px;}
			</style>';
		}
	} );

	/* 編集フォーム HTML */
	function lw_add_category_thumbnail_field( $term ) {
		$thumbnail_id = get_term_meta( $term->term_id, 'category_thumbnail_id', true );
		$image_url    = $thumbnail_id ? wp_get_attachment_image_url( $thumbnail_id, 'thumbnail' ) : '';
		?>
<tr class="form-field">
	<th scope="row"><label>アイキャッチ画像</label></th>
	<td>
		<div class="category-thumbnail-wrapper">
			<img id="category_thumbnail_preview" src="<?php echo esc_url( $image_url ); ?>" style="display:<?php echo $image_url ? 'block':'none'; ?>">
			<div class="category-thumbnail-buttons">
				<button class="upload_category_thumbnail_button button">画像をアップロード</button>
				<button class="remove_category_thumbnail_button button" style="display:<?php echo $image_url ? 'block':'none'; ?>">画像を削除</button>
			</div>
		</div>
		<input type="hidden" id="category_thumbnail_id" name="category_thumbnail_id" value="<?php echo esc_attr( $thumbnail_id ); ?>">
		<p>このカテゴリーのアイキャッチ画像を設定できます。</p>
	</td>
</tr>
		<?php
	}
	add_action( 'category_edit_form_fields', 'lw_add_category_thumbnail_field' );

	/* 保存 */
	function lw_save_category_thumbnail( $term_id ) {
		if ( isset( $_POST['category_thumbnail_id'] ) ) {
			update_term_meta( $term_id, 'category_thumbnail_id', absint( $_POST['category_thumbnail_id'] ) );
		}
	}
	add_action( 'edited_category', 'lw_save_category_thumbnail' );

	/* メディアアップローダー JS */
	function lw_enqueue_category_thumbnail_script() {
		if ( isset( $_GET['taxonomy'] ) && $_GET['taxonomy'] === 'category' ) {
			wp_enqueue_media(); ?>
<script>
jQuery(function($){
	$('.upload_category_thumbnail_button').on('click', function(e){
		e.preventDefault();
		const uploader = wp.media({ title:'画像を選択', button:{ text:'画像を使用' }, multiple:false });
		uploader.on('select', function(){
			const at = uploader.state().get('selection').first().toJSON();
			$('#category_thumbnail_id').val(at.id);
			$('#category_thumbnail_preview').attr('src', at.url).show();
			$('.remove_category_thumbnail_button').show();
		}).open();
	});
	$('.remove_category_thumbnail_button').on('click', function(e){
		e.preventDefault();
		$('#category_thumbnail_id').val('');
		$('#category_thumbnail_preview').hide();
		$(this).hide();
	});
});
</script>
<?php	}
	}
	add_action( 'admin_footer', 'lw_enqueue_category_thumbnail_script' );
}

/* ==============================================================
 * 2) カテゴリー一覧：並び順ソート（terms_clauses）
 * ============================================================== */
function lw_category_admin_custom_order( $clauses, $taxonomies, $args ) {
	if ( ! is_admin() || ! in_array( 'category', (array) $taxonomies, true ) ) {
		return $clauses;
	}
	global $wpdb;

	if ( strpos( $clauses['join'], 'category_sort_order' ) === false ) {
		$clauses['join'] .= $wpdb->prepare(
			" LEFT JOIN {$wpdb->termmeta} AS cso
			  ON cso.term_id = t.term_id
			 AND cso.meta_key = %s",
			'category_sort_order'
		);
	}

	$clauses['orderby'] = "
		ORDER BY
		CASE
			WHEN cso.meta_value IS NULL OR cso.meta_value = '' THEN 999
			ELSE CAST(cso.meta_value AS UNSIGNED)
		END,
		t.name
	";
	return $clauses;
}
add_filter( 'terms_clauses', 'lw_category_admin_custom_order', 10, 3 );

/* ==============================================================
 * 3) カテゴリー編集フォーム：レイアウト／SEO／並び順 他
 *     + リダイレクト元（旧 URL）フィールド  ★追加
 * ============================================================== */
function lw_add_category_layout_field( $term ) {

	/* 現在のメタ値を取得 */
	$layout               = get_term_meta( $term->term_id, 'category_layout', true );
	$fv_pattern           = get_term_meta( $term->term_id, 'category_post_fv_ptn', true );
	$archive_fv_pattern   = get_term_meta( $term->term_id, 'category_archive_fv_ptn', true );
	$archive_list_pattern = get_term_meta( $term->term_id, 'category_archive_list_ptn', true );
	$seo_title            = get_term_meta( $term->term_id, 'category_seo_title', true );
	$meta_description     = get_term_meta( $term->term_id, 'category_meta_description', true );
	$seo_noindex          = get_term_meta( $term->term_id, 'category_noindex', true );
	$long_description     = get_term_meta( $term->term_id, 'category_long_description', true );
	$sort_order           = get_term_meta( $term->term_id, 'category_sort_order', true );
	/* ★追加：旧 URL */
	$redirect_from_url    = get_term_meta( $term->term_id, 'category_redirect_from_url', true );
	?>
<!-- ▼ 並び順 -->
<tr class="form-field">
	<th scope="row"><label for="category_sort_order">並び順</label></th>
	<td>
		<input type="number" min="0" name="category_sort_order" id="category_sort_order" value="<?php echo esc_attr( $sort_order ); ?>" class="small-text">
		<p class="description">数字が小さいほど優先的に表示されます。</p>
	</td>
</tr>

<!-- ★▼ リダイレクト元（旧 URL） -->
<tr class="form-field">
	<th scope="row"><label for="category_redirect_from_url">リダイレクト元（旧 URL）</label></th>
	<td>
		<input type="url" name="category_redirect_from_url" id="category_redirect_from_url" class="regular-text"
		       placeholder="http://example.com/old-category" value="<?php echo esc_attr( $redirect_from_url ); ?>">
		<p class="description">
			このテーマ内だけで完結する 301 リダイレクト設定です。<br>
			<strong>サイト内の旧 URL</strong>（例: <code>/old-category</code> や <code>http://example.com/old-category</code>）を入力してください。
		</p>
	</td>
</tr>

<!-- ▼ カテゴリーページ本文 -->
<tr class="form-field">
	<th scope="row"><label for="category_long_description">カテゴリーページ本文</label></th>
	<td>
		<?php
			wp_editor(
				$long_description,
				'category_long_description',
				[
					'textarea_name' => 'category_long_description',
					'textarea_rows' => 10,
					'media_buttons' => true,
				]
			);
		?>
	</td>
</tr>

<!-- ▼ SEO用タイトル -->
<tr class="form-field">
	<th scope="row"><label for="category_seo_title">SEO用タイトル（titleタグ）</label></th>
	<td>
		<input type="text" name="category_seo_title" id="category_seo_title" value="<?php echo esc_attr( $seo_title ); ?>" class="regular-text">
		<p class="description">空欄の場合はカテゴリー名が使用されます。</p>
	</td>
</tr>

<!-- ▼ メタディスクリプション -->
<tr class="form-field">
	<th scope="row"><label for="category_meta_description">メタディスクリプション</label></th>
	<td>
		<textarea name="category_meta_description" id="category_meta_description" rows="3" class="large-text"><?php echo esc_textarea( $meta_description ); ?></textarea>
	</td>
</tr>

<!-- ▼ noindex 設定 -->
<tr class="form-field">
	<th scope="row"><label for="category_noindex">noindex 設定</label></th>
	<td>
		<label>
			<input type="checkbox" name="category_noindex" id="category_noindex" value="noindex" <?php checked( $seo_noindex, 'noindex' ); ?>>
			検索エンジンにインデックスさせない
		</label>
	</td>
</tr>

<!-- 以下、パターン・レイアウト項目は元コードと同じ -->
<!-- ▼ 投稿アーカイブ：FVパターン -->
<tr class="form-field">
	<th scope="row"><label for="category_archive_fv_ptn">投稿アーカイブ：FVパターン</label></th>
	<td>
		<select name="category_archive_fv_ptn" id="category_archive_fv_ptn">
			<option value=""      <?php selected( $archive_fv_pattern, '' );      ?>>未選択</option>
			<option value="ptn_1" <?php selected( $archive_fv_pattern, 'ptn_1' ); ?>>パターン1</option>
			<option value="ptn_2" <?php selected( $archive_fv_pattern, 'ptn_2' ); ?>>パターン2</option>
			<option value="ptn_3" <?php selected( $archive_fv_pattern, 'ptn_3' ); ?>>パターン3</option>
			<option value="ptn_none" <?php selected( $archive_fv_pattern, 'ptn_none' ); ?>>非表示</option>
		</select>
	</td>
</tr>

<!-- ▼ 投稿アーカイブ：投稿一覧パターン -->
<tr class="form-field">
	<th scope="row"><label for="category_archive_list_ptn">投稿アーカイブ：投稿一覧パターン</label></th>
	<td>
		<select name="category_archive_list_ptn" id="category_archive_list_ptn">
			<option value=""      <?php selected( $archive_list_pattern, '' );      ?>>未選択</option>
			<option value="ptn_1" <?php selected( $archive_list_pattern, 'ptn_1' ); ?>>パターン1</option>
			<option value="ptn_2" <?php selected( $archive_list_pattern, 'ptn_2' ); ?>>パターン2</option>
			<option value="ptn_3" <?php selected( $archive_list_pattern, 'ptn_3' ); ?>>パターン3</option>
			<option value="ptn_4" <?php selected( $archive_list_pattern, 'ptn_4' ); ?>>パターン4</option>
		</select>
	</td>
</tr>

<!-- ▼ 投稿ページ：レイアウト -->
<tr class="form-field">
	<th scope="row"><label for="category_layout">投稿ページ：レイアウト</label></th>
	<td>
		<select name="category_layout" id="category_layout">
			<option value=""            <?php selected( $layout, '' );            ?>>未選択</option>
			<option value="clm_1"       <?php selected( $layout, 'clm_1' );       ?>>1カラム</option>
			<option value="clm_2_left"  <?php selected( $layout, 'clm_2_left' );  ?>>2カラム（左サイドバー）</option>
			<option value="clm_2_right" <?php selected( $layout, 'clm_2_right' ); ?>>2カラム（右サイドバー）</option>
		</select>
	</td>
</tr>

<!-- ▼ 投稿ページ：FVパターン -->
<tr class="form-field">
	<th scope="row"><label for="category_post_fv_ptn">投稿ページ：FVパターン</label></th>
	<td>
		<select name="category_post_fv_ptn" id="category_post_fv_ptn">
			<option value=""         <?php selected( $fv_pattern, '' );         ?>>未選択</option>
			<option value="fv_ptn_1" <?php selected( $fv_pattern, 'fv_ptn_1' ); ?>>パターン1</option>
			<option value="fv_ptn_2" <?php selected( $fv_pattern, 'fv_ptn_2' ); ?>>パターン2</option>
			<option value="fv_ptn_3" <?php selected( $fv_pattern, 'fv_ptn_3' ); ?>>パターン3</option>
		</select>
	</td>
</tr>
<?php
}
add_action( 'category_edit_form_fields', 'lw_add_category_layout_field' );

/* ----------------- 保存処理 ----------------- */
function lw_save_category_layout( $term_id ) {

	$meta_map = [
		'category_layout'            => 'sanitize_text_field',
		'category_post_fv_ptn'       => 'sanitize_text_field',
		'category_archive_fv_ptn'    => 'sanitize_text_field',
		'category_archive_list_ptn'  => 'sanitize_text_field',
		'category_seo_title'         => 'sanitize_text_field',
		'category_meta_description'  => 'sanitize_textarea_field',
		'category_long_description'  => 'wp_kses_post',
		'category_sort_order'        => 'absint',
		'category_redirect_from_url' => 'esc_url_raw',      // ★ 追加
	];

	foreach ( $meta_map as $field => $callback ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_term_meta( $term_id, $field, call_user_func( $callback, $_POST[ $field ] ) );
		}
	}

	/* noindex チェックボックス */
	if ( isset( $_POST['category_noindex'] ) && $_POST['category_noindex'] === 'noindex' ) {
		update_term_meta( $term_id, 'category_noindex', 'noindex' );
	} else {
		delete_term_meta( $term_id, 'category_noindex' );
	}
}
add_action( 'edited_category', 'lw_save_category_layout' );

/* ==============================================================
 * 4) 旧 URL → 新カテゴリー URL へ 301 転送（template_redirect）
 * ============================================================== */
add_action( 'template_redirect', function () {

	/* 管理画面／Cron／プレビューは除外 */
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || isset( $_GET['preview'] ) ) {
		return;
	}

	/* 現在アクセスされた URL を正規化 */
	$current_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
	$normalize   = function ( $url ) {
		$url = untrailingslashit( $url );
		$url = preg_replace( '#^https?:\/\/#i', '', $url );
		return strtolower( $url );
	};
	$key = $normalize( $current_url );

	/* 旧 URL を meta に持つカテゴリーを逆引き */
	global $wpdb;
	$term_id = $wpdb->get_var( $wpdb->prepare(
		"SELECT term_id
		 FROM {$wpdb->termmeta}
		 WHERE meta_key = %s
		   AND LOWER(TRIM(TRAILING '/' FROM REPLACE(REPLACE(meta_value, 'http://', ''), 'https://', ''))) = %s
		 LIMIT 1",
		'category_redirect_from_url',
		$key
	) );

	if ( ! $term_id ) {
		return; // 該当なし
	}

	$target = get_term_link( (int) $term_id, 'category' );
	if ( is_wp_error( $target ) ) {
		return;
	}

	/* 無限ループ防止 */
	if ( $normalize( $target ) === $key ) {
		return;
	}

	wp_redirect( esc_url_raw( $target ), 301 );
	exit;
} );
