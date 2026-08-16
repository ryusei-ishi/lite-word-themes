<?php
if ( !defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * LiteWord   ― 会員限定表示機能（カテゴリー単位・管理画面）
 *
 * 投稿・固定ページ単位の設定は restrict_admin.php。
 * こちらはカテゴリーに設定して、そのカテゴリーの投稿とカテゴリー一覧ページを
 * まとめて守る。保存先は term meta の `_lw_allowed_roles`
 * （post meta と同じキー名だがテーブルが別なので衝突しない）。
 *
 * 判定そのものは roles.php ／ フロントの適用は restrict_front.php。
 * =============================================================== */

/**
 * ① カテゴリー編集画面に「観覧権限」欄を追加
 *
 * ⚠️ 新規追加フォーム（category_add_form_fields）には出さない。
 *    既存のカテゴリー設定（レイアウト・SEO 等）も編集画面だけに出しており、
 *    そちらに合わせている。作成後に編集画面から設定する。
 */
add_action( 'category_edit_form_fields', 'lw_add_category_view_role_field' );
function lw_add_category_view_role_field( $term ) {

	$saved = lw_get_term_allowed_roles( $term->term_id );
	$roles = wp_roles()->roles;

	wp_nonce_field( 'lw_category_view_role_save', 'lw_category_view_role_nonce' );
	?>
	<tr class="form-field">
		<th scope="row"><label>観覧権限</label></th>
		<td>
			<p class="description" style="margin:0 0 8px;">
				チェックを付けた権限だけ閲覧可（無選択なら全員可）。<br>
				このカテゴリーの<strong>投稿</strong>と<strong>カテゴリー一覧ページ</strong>の両方に効きます。<br>
				投稿側の「観覧権限」が設定されている場合は、<strong>そちらが優先</strong>されます。
			</p>
			<?php foreach ( $roles as $role_key => $role_data ) : ?>
				<label style="display:block;margin-bottom:4px;">
					<input type="checkbox" name="lw_category_allowed_roles[]" value="<?php echo esc_attr( $role_key ); ?>"
						<?php checked( in_array( $role_key, $saved, true ) ); ?>>
					<?php echo esc_html( translate_user_role( $role_data['name'] ) ); ?>
				</label>
			<?php endforeach; ?>
		</td>
	</tr>

	<!-- ▼ 適用範囲 -->
	<tr class="form-field">
		<th scope="row"><label for="lw_category_restrict_scope">観覧権限の適用範囲</label></th>
		<td>
			<?php $scope = lw_get_term_restrict_scope( $term->term_id ); ?>
			<select name="lw_category_restrict_scope" id="lw_category_restrict_scope">
				<option value="both"    <?php selected( $scope, 'both' );    ?>>投稿とカテゴリー一覧の両方（既定）</option>
				<option value="single"  <?php selected( $scope, 'single' );  ?>>投稿だけ（カテゴリー一覧は誰でも見られる）</option>
				<option value="archive" <?php selected( $scope, 'archive' ); ?>>カテゴリー一覧だけ（投稿は誰でも見られる）</option>
			</select>
			<p class="description">
				上の「観覧権限」をどこに効かせるかです。<br>
				「投稿だけ」にすると、記事の一覧（カテゴリーページ）は誰でも見られて、記事を開くとログインが必要になります。
			</p>
		</td>
	</tr>
	<?php
}

/**
 * ② 保存処理
 *
 * ⚠️ nonce が無ければ何もせずに戻る。
 *    `edited_category` はクイック編集からも発火するが、そちらのフォームには
 *    この nonce もチェックボックスも無い。ここで抜けないと
 *    「クイック編集で名前を直しただけで閲覧権限が全部消える」ことになる。
 */
add_action( 'edited_category', 'lw_save_category_view_role' );
function lw_save_category_view_role( $term_id ) {

	if ( ! current_user_can( 'manage_categories' ) ) {
		return;
	}
	if ( ! isset( $_POST['lw_category_view_role_nonce'] ) ||
	     ! wp_verify_nonce( $_POST['lw_category_view_role_nonce'], 'lw_category_view_role_save' ) ) {
		return;
	}

	$roles = ( isset( $_POST['lw_category_allowed_roles'] ) && is_array( $_POST['lw_category_allowed_roles'] ) )
		? array_values( array_filter( array_map( 'sanitize_key', $_POST['lw_category_allowed_roles'] ) ) )
		: [];

	if ( empty( $roles ) ) {
		delete_term_meta( $term_id, '_lw_allowed_roles' );
	} else {
		update_term_meta( $term_id, '_lw_allowed_roles', $roles );
	}

	// 適用範囲（既定の both のときはメタを持たない）
	$scope = isset( $_POST['lw_category_restrict_scope'] ) ? sanitize_key( $_POST['lw_category_restrict_scope'] ) : 'both';
	if ( in_array( $scope, [ 'single', 'archive' ], true ) ) {
		update_term_meta( $term_id, '_lw_restrict_scope', $scope );
	} else {
		delete_term_meta( $term_id, '_lw_restrict_scope' );
	}

	// このカテゴリーに属する投稿のキャッシュもまとめて無効化する
	lw_bump_allowed_roles_cache_version();
}

/* -------------------------------------------------- *
 * ③ カテゴリー一覧テーブルに「閲覧権限」列を追加
 * -------------------------------------------------- */

/** 列追加 */
add_filter( 'manage_edit-category_columns', 'lw_add_category_view_role_column' );
function lw_add_category_view_role_column( $columns ) {
	$columns['lw_view_roles'] = '閲覧権限';
	return $columns;
}

/** 列内容 */
add_filter( 'manage_category_custom_column', 'lw_render_category_view_role_column', 10, 3 );
function lw_render_category_view_role_column( $content, $column_name, $term_id ) {

	if ( $column_name !== 'lw_view_roles' ) {
		return $content;
	}

	$roles = lw_get_term_allowed_roles( $term_id );
	if ( empty( $roles ) ) {
		return '<span class="lw-role-label">全員可</span>';
	}

	$all_roles = wp_roles()->roles;
	$names = array_map( function ( $role_key ) use ( $all_roles ) {
		return esc_html( translate_user_role( $all_roles[ $role_key ]['name'] ?? $role_key ) );
	}, $roles );

	$scope_label = [
		'both'    => '',
		'single'  => '<br><span style="color:#646970;">投稿だけ</span>',
		'archive' => '<br><span style="color:#646970;">一覧だけ</span>',
	];
	$scope = lw_get_term_restrict_scope( $term_id );

	return implode( ', ', $names ) . ( $scope_label[ $scope ] ?? '' );
}
