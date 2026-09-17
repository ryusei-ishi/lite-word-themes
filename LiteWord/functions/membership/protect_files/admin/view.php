<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 管理画面の本体（状態・確かめ方・機能しない場合）
 * =============================================================== */

function lw_member_files_admin_render() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( '権限がありません。' );
	}

	$enabled   = lw_member_files_enabled();
	$state     = lw_member_files_state();
	$check     = lw_member_files_get_check();
	$index     = lw_member_files_get_index();
	$customize = add_query_arg( 'autofocus[section]', 'lw_membership_sec', admin_url( 'customize.php' ) );
	$date      = function ( $time ) {
		return $time ? wp_date( 'Y年n月j日 H:i', (int) $time ) : '—';
	};
	?>
<div class="wrap">
	<h1>会員限定のファイル</h1>

	<?php if ( isset( $_GET['lw_msg'] ) && $_GET['lw_msg'] === 'rechecked' ) : ?>
		<div class="notice notice-success is-dismissible"><p>一覧を作り直して、点検しました。</p></div>
	<?php endif; ?>
	<?php foreach ( lw_member_files_problems() as $problem ) : ?>
		<div class="notice notice-<?php echo esc_attr( $problem[0] ); ?> inline"><p><?php echo esc_html( $problem[1] ); ?></p></div>
	<?php endforeach; ?>

	<p style="max-width:820px;">
		会員限定の記事に入れた写真・PDF などのファイルを、その記事を見る権限のある人にだけ渡す設定の状態です。<br>
		ON / OFF は <a href="<?php echo esc_url( $customize ); ?>">外観 &gt; カスタマイズ &gt; 会員限定ページ設定</a> で切り替えます。
	</p>

	<h2>いまの状態</h2>
	<table class="widefat striped" style="max-width:820px;">
		<tbody>
			<tr>
				<th scope="row" style="width:30%;">設定</th>
				<td><?php echo $enabled ? '<strong>ON</strong>（守る）' : 'OFF（守らない）'; ?></td>
			</tr>
			<tr>
				<th scope="row">.htaccess のルール</th>
				<td><?php echo esc_html( $state['error'] !== '' ? lw_member_files_error_text( $state['error'] ) : ( $state['active'] ? '書き込み済み' : '—' ) ); ?></td>
			</tr>
			<tr>
				<th scope="row">点検の結果</th>
				<td>
					<?php if ( empty( $check['result'] ) ) : ?>
						まだ点検していません
					<?php else : ?>
						<?php echo esc_html( lw_member_files_check_text( $check['result'] )[1] ); ?><br>
						<span class="description"><?php echo esc_html( $date( $check['checked_at'] ) . '（' . $check['detail'] . '）' ); ?></span>
					<?php endif; ?>
				</td>
			</tr>
			<tr>
				<th scope="row">一覧を作った日時</th>
				<td><?php echo esc_html( $date( isset( $index['built_at'] ) ? $index['built_at'] : 0 ) ); ?></td>
			</tr>
		</tbody>
	</table>

	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin:16px 0 32px;">
		<?php wp_nonce_field( 'lw_member_files_recheck' ); ?>
		<input type="hidden" name="action" value="lw_member_files_recheck">
		<?php submit_button( '一覧を作り直して、もう一度点検する', 'secondary', 'submit', false ); ?>
	</form>

	<h2>自分の目で確かめる</h2>
	<ol style="max-width:820px;">
		<li>ログアウトするか、別のブラウザ（シークレットウィンドウ）を開きます。</li>
		<li>下の「守っているファイル」のリンクを、そのブラウザで開きます。</li>
		<li>見られなければ守れています。見られた場合は、下の「機能しない場合」に当てはまっていないか確かめてください。</li>
	</ol>

	<?php lw_member_files_admin_render_lists( $index ); ?>

	<h2>機能しない場合</h2>
	<ul style="max-width:820px;list-style:disc;padding-left:20px;">
		<?php foreach ( lw_member_files_limitations() as $text ) : ?>
			<li><?php echo esc_html( $text ); ?></li>
		<?php endforeach; ?>
	</ul>

	<?php if ( $state['error'] === 'htaccess_not_writable' ) : ?>
		<h2>手で書くときのルール</h2>
		<p style="max-width:820px;">サイトのフォルダにある .htaccess の「# BEGIN WordPress」より上に、次をそのまま書き足してください。</p>
		<textarea class="large-text code" rows="12" readonly><?php
			echo esc_textarea( implode( "\n", array_merge(
				[ '# BEGIN ' . lw_member_files_htaccess_marker() ],
				lw_member_files_htaccess_lines(),
				[ '# END ' . lw_member_files_htaccess_marker() ]
			) ) );
		?></textarea>
	<?php endif; ?>
</div>
	<?php
}
