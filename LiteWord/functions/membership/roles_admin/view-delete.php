<?php
/**
 * 権限（ロール）の設定 — 削除の確認画面
 *
 * 消す前に「誰が困るか」を見せる画面。
 *   ・そのロールのユーザー → 移動先を選ばせる（選ばないと権限のない人が残る）
 *   ・会員限定の設定で使用中 → 外さないと「誰も見られない記事」ができる
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function lw_roles_admin_render_delete() {

	$slug     = isset( $_GET['role'] ) ? sanitize_key( wp_unslash( $_GET['role'] ) ) : '';
	$back_url = add_query_arg( 'page', 'lw-roles', admin_url( 'users.php' ) );

	if ( ! isset( wp_roles()->roles[ $slug ] ) || ! lw_is_custom_role( $slug ) ) {
		printf(
			'<div class="wrap"><h1>権限（ロール）の設定</h1><div class="notice notice-error"><p>%s</p></div><p><a href="%s">一覧に戻る</a></p></div>',
			'削除できない権限が指定されました。LiteWord で追加した権限だけ削除できます。',
			esc_url( $back_url )
		);
		return;
	}

	$name  = translate_user_role( wp_roles()->roles[ $slug ]['name'] );
	$users = lw_count_users_with_role( $slug );
	$usage = lw_count_membership_usage( $slug );
	?>
<div class="wrap">
	<h1>権限を削除</h1>

	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="max-width:640px;">
		<?php wp_nonce_field( 'lw_roles_delete_' . $slug ); ?>
		<input type="hidden" name="action" value="lw_roles_delete">
		<input type="hidden" name="role" value="<?php echo esc_attr( $slug ); ?>">

		<div class="card" style="max-width:640px;padding:20px;">
			<h2 style="margin-top:0;">
				<?php echo esc_html( $name ); ?>
				<code style="font-size:13px;font-weight:400;"><?php echo esc_html( $slug ); ?></code>
				を削除しますか？
			</h2>

			<?php if ( $users || $usage ) : ?>
				<ul style="margin:16px 0;list-style:none;">
					<?php if ( $users ) : ?>
						<li style="color:#b32d2e;">⚠ このロールのユーザー <strong><?php echo esc_html( $users ); ?> 人</strong></li>
					<?php endif; ?>
					<?php if ( $usage ) : ?>
						<li style="color:#b32d2e;">⚠ 会員限定の設定で <strong><?php echo esc_html( $usage ); ?> 箇所</strong> 使用中</li>
					<?php endif; ?>
				</ul>
			<?php else : ?>
				<p style="margin:16px 0;color:#646970;">このロールはどこにも使われていません。そのまま削除できます。</p>
			<?php endif; ?>

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="lw_move_to">ユーザーの移動先</label></th>
					<td>
						<select name="lw_move_to" id="lw_move_to">
							<?php foreach ( wp_roles()->roles as $key => $data ) :
								// 🚨 管理者は出さない。ここで選ぶと該当ユーザーが一括で管理者になってしまう。
								//    本当に管理者にしたいときはユーザー編集画面から1人ずつ行う。
								if ( $key === $slug || $key === 'administrator' ) continue; ?>
								<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $key, 'subscriber' ); ?>>
									<?php echo esc_html( translate_user_role( $data['name'] ) ); ?>
								</option>
							<?php endforeach; ?>
						</select>
						<p class="description">
							このロールのユーザーをどの権限に移すか。<br>
							ほかの権限も持っている人は、そのまま（このロールを外すだけ）です。<br>
							<strong>管理者は選べません</strong>（まとめて管理者になってしまう事故を防ぐため）。
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">会員限定の設定</th>
					<td>
						<label>
							<input type="checkbox" name="lw_strip_meta" value="1" checked>
							会員限定の設定からもこのロールを外す
						</label>
						<p class="description">
							<strong>外さないと、そのロールを指定していた記事は誰も見られなくなります</strong>（管理者を除く）。
						</p>
					</td>
				</tr>
			</table>

			<p style="margin-bottom:0;">
				<a href="<?php echo esc_url( $back_url ); ?>" class="button">キャンセル</a>
				<button type="submit" class="button button-primary" style="background:#b32d2e;border-color:#b32d2e;">削除する</button>
			</p>
		</div>
	</form>
</div>
	<?php
}
