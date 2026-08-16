<?php
/**
 * 権限（ロール）の設定 — 一覧と「新しい権限を追加」フォーム
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function lw_roles_admin_render_list() {

	$roles  = wp_roles()->roles;
	$custom = lw_get_custom_role_slugs();
	?>
<div class="wrap lw-roles">
	<h1 class="wp-heading-inline">権限（ロール）の設定</h1>
	<?php lw_roles_admin_notice(); ?>

	<p class="description" style="max-width:820px;margin:12px 0 20px;">
		ユーザーに与える「権限」の名前を変えたり、新しい権限を追加したりできます。<br>
		ここで付けた名前は<strong>会員限定の設定（投稿・カテゴリーの「観覧権限」）にもそのまま出ます</strong>。
	</p>

	<div class="notice notice-warning inline" style="max-width:820px;margin:0 0 24px;">
		<p style="margin:8px 0;"><strong>変更する前に</strong></p>
		<ul style="margin:0 0 8px 20px;list-style:disc;">
			<li>権限は<strong>サイト全体の設定</strong>です。ユーザー一覧やユーザー編集など、WordPress の管理画面すべてに反映されます。</li>
			<li>会員限定の設定は<strong>スラッグ</strong>で保存しているので、<strong>名前を変えても既存の設定は壊れません</strong>。</li>
			<li>この設定は<strong>テーマを切り替えても残ります</strong>。元に戻すときは各行の「元に戻す」を押してください。</li>
		</ul>
	</div>

	<h2>権限の一覧</h2>
	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" id="lw_roles_form">
		<?php wp_nonce_field( 'lw_roles_save' ); ?>
		<input type="hidden" name="action" value="lw_roles_save">

		<table class="wp-list-table widefat fixed striped">
			<thead>
				<tr>
					<th style="width:22%">表示名</th>
					<th style="width:18%">スラッグ</th>
					<th style="width:18%">できること</th>
					<th style="width:13%">種類</th>
					<th style="width:9%">ユーザー</th>
					<th style="width:10%">会員限定</th>
					<th style="width:10%">操作</th>
				</tr>
			</thead>
			<tbody>
			<?php foreach ( $roles as $slug => $data ) :
				$is_custom = in_array( $slug, $custom, true );
				$changed   = lw_role_name_is_changed( $slug );
				$users     = lw_count_users_with_role( $slug );
				$usage     = lw_count_membership_usage( $slug );
				$name      = translate_user_role( $data['name'] );
				$base      = $is_custom ? lw_detect_role_base( $slug ) : '';
				?>
				<tr>
					<td>
						<input type="text" class="regular-text" style="width:100%"
						       name="lw_role_names[<?php echo esc_attr( $slug ); ?>]"
						       value="<?php echo esc_attr( $name ); ?>"
						       maxlength="50">
					</td>
					<td><code><?php echo esc_html( $slug ); ?></code></td>
					<td>
						<?php if ( ! $is_custom ) : ?>
							<span style="color:#a7aaad">—</span>
						<?php else : ?>
							<select name="lw_role_bases[<?php echo esc_attr( $slug ); ?>]" style="width:100%"
							        data-current="<?php echo esc_attr( $base ); ?>"
							        data-users="<?php echo esc_attr( $users ); ?>"
							        data-label="<?php echo esc_attr( $name ); ?>">
								<?php if ( $base === '' ) : ?>
									<option value="" selected>カスタム（変更しない）</option>
								<?php endif; ?>
								<?php foreach ( lw_role_base_choices() as $b ) :
									if ( ! isset( $roles[ $b ] ) ) continue; ?>
									<option value="<?php echo esc_attr( $b ); ?>" <?php selected( $b, $base ); ?>>
										<?php echo esc_html( translate_user_role( $roles[ $b ]['name'] ) . 'と同じ（' . ( lw_role_base_notes()[ $b ] ?? '' ) . '）' ); ?>
									</option>
								<?php endforeach; ?>
							</select>
						<?php endif; ?>
					</td>
					<td>
						<?php if ( $is_custom ) : ?>
							<span style="color:#2271b1;font-weight:600;">LiteWord で追加</span>
						<?php elseif ( in_array( $slug, [ 'administrator', 'editor', 'author', 'contributor', 'subscriber' ], true ) ) : ?>
							WordPress 標準
						<?php else : ?>
							プラグイン等
						<?php endif; ?>
						<?php if ( $changed ) : ?>
							<br><span style="color:#646970;font-size:12px;">名前を変更済み<br>（元: <?php echo esc_html( lw_get_role_original_name( $slug ) ); ?>）</span>
						<?php endif; ?>
					</td>
					<td><?php echo $users ? esc_html( $users ) . ' 人' : '<span style="color:#a7aaad">—</span>'; ?></td>
					<td><?php echo $usage ? esc_html( $usage ) . ' 箇所' : '<span style="color:#a7aaad">—</span>'; ?></td>
					<td>
						<?php if ( $changed ) : ?>
							<a href="<?php echo esc_url( lw_roles_admin_action_url( 'lw_roles_reset_name', $slug, 'lw_roles_reset_name_' . $slug ) ); ?>">元に戻す</a>
						<?php endif; ?>
						<?php if ( $is_custom ) : ?>
							<?php echo $changed ? ' | ' : ''; ?>
							<a href="<?php echo esc_url( add_query_arg( [ 'page' => 'lw-roles', 'lw_view' => 'delete', 'role' => $slug ], admin_url( 'users.php' ) ) ); ?>"
							   style="color:#b32d2e;">削除</a>
						<?php endif; ?>
						<?php if ( ! $changed && ! $is_custom ) : ?>
							<span style="color:#a7aaad">—</span>
						<?php endif; ?>
					</td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>

		<p><button type="submit" class="button button-primary">名前・できることの変更を保存</button></p>
	</form>

<script>
/* できることを変えるときだけ確認する。
   そのロールを持っている人に即座に効くので、人数を出してから保存させる。 */
document.addEventListener( 'DOMContentLoaded', function () {
	var form = document.getElementById( 'lw_roles_form' );
	if ( ! form ) return;

	form.addEventListener( 'submit', function ( e ) {
		var changed = [];
		form.querySelectorAll( 'select[data-current]' ).forEach( function ( sel ) {
			if ( sel.value === '' || sel.value === sel.dataset.current ) return;
			var users = parseInt( sel.dataset.users, 10 ) || 0;
			var opt   = sel.options[ sel.selectedIndex ].textContent.trim();
			changed.push( '・' + sel.dataset.label + ' → ' + opt
				+ ( users ? '（このロールのユーザー ' + users + ' 人にすぐ反映されます）' : '（ユーザーなし）' ) );
		} );
		if ( ! changed.length ) return;

		if ( ! window.confirm( '次の権限を変更します。\n\n' + changed.join( '\n' ) + '\n\nよろしいですか？' ) ) {
			e.preventDefault();
		}
	} );
} );
</script>

	<hr style="margin:32px 0;">

	<h2>新しい権限を追加</h2>
	<p class="description" style="max-width:820px;">
		会員ランクを分けたいときに使います（例:「プレミアム会員」「スクール生」）。<br>
		できることは、ベースに選んだ権限からそのままコピーされます。<strong>会員ランク分けなら「読むだけ」で足ります。</strong>
	</p>

	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
		<?php wp_nonce_field( 'lw_roles_create' ); ?>
		<input type="hidden" name="action" value="lw_roles_create">

		<table class="form-table" role="presentation">
			<tr>
				<th scope="row"><label for="lw_new_role_name">表示名 <span style="color:#b32d2e">*</span></label></th>
				<td>
					<input type="text" name="lw_new_role_name" id="lw_new_role_name" class="regular-text" maxlength="50" required
					       placeholder="プレミアム会員">
				</td>
			</tr>
			<tr>
				<th scope="row"><label for="lw_new_role_slug">スラッグ</label></th>
				<td>
					<input type="text" name="lw_new_role_slug" id="lw_new_role_slug" class="regular-text"
					       placeholder="premium_member">
					<p class="description">
						半角英数字とアンダースコアだけ。<strong>頭に自動で <code>lw_</code> が付きます</strong>（例: <code>lw_premium_member</code>）。<br>
						空欄なら自動で決まります。<strong>あとから変更できません。</strong>
					</p>
				</td>
			</tr>
			<tr>
				<th scope="row"><label for="lw_new_role_base">ベースにする権限</label></th>
				<td>
					<select name="lw_new_role_base" id="lw_new_role_base">
						<?php foreach ( lw_role_base_choices() as $base ) :
							if ( ! isset( $roles[ $base ] ) ) continue;
							$label = translate_user_role( $roles[ $base ]['name'] );
							$note  = lw_role_base_notes()[ $base ] ?? '';
							?>
							<option value="<?php echo esc_attr( $base ); ?>" <?php selected( $base, 'subscriber' ); ?>>
								<?php echo esc_html( $label . 'と同じ（' . $note . '）' ); ?>
							</option>
						<?php endforeach; ?>
					</select>
					<p class="description">管理者はベースに選べません（権限を与えすぎる事故を防ぐため）。</p>
				</td>
			</tr>
		</table>

		<p><button type="submit" class="button button-primary">追加する</button></p>
	</form>
</div>
	<?php
}
