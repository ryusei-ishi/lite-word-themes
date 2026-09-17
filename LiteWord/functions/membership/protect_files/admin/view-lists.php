<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/* ===============================================================
 * 会員限定のファイルを守る ― 管理画面の一覧（守っている／守っていない）
 * =============================================================== */

/** 1つの表に出す最大の行数（多いサイトで画面が重くならないように） */
function lw_member_files_admin_list_limit() {
	return 300;
}

/**
 * @param array $index lw_member_files_get_index()
 * @return void
 */
function lw_member_files_admin_render_lists( array $index ) {
	$protected = isset( $index['protected'] ) ? $index['protected'] : [];
	$skipped   = isset( $index['skipped'] ) ? $index['skipped'] : [];
	?>
	<h2>守っているファイル（<?php echo esc_html( number_format_i18n( count( $protected ) ) ); ?>件）</h2>
	<?php if ( ! $protected ) : ?>
		<p>ありません。</p>
	<?php else : ?>
		<table class="widefat striped" style="max-width:1100px;">
			<thead><tr><th style="width:50%;">ファイル</th><th>使っている会員限定の記事</th></tr></thead>
			<tbody>
			<?php foreach ( array_slice( $protected, 0, lw_member_files_admin_list_limit() ) as $item ) : ?>
				<tr>
					<td><?php lw_member_files_admin_file_cell( $item ); ?></td>
					<td><?php lw_member_files_admin_posts_cell( $item['posts'] ); ?></td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>
		<?php lw_member_files_admin_more_note( count( $protected ) ); ?>
	<?php endif; ?>

	<h2>守っていないファイル（<?php echo esc_html( number_format_i18n( count( $skipped ) ) ); ?>件）</h2>
	<p style="max-width:820px;">
		会員限定の記事で使っていますが、公開の場所でも使っているため守っていません（守ると公開ページで表示されなくなるため）。<br>
		守りたいときは、公開の場所から外すか、別のファイルに差し替えてください。直すと、この一覧は自動で作り直されます。
	</p>
	<?php if ( ! $skipped ) : ?>
		<p>ありません。</p>
	<?php else : ?>
		<table class="widefat striped" style="max-width:1100px;">
			<thead><tr><th style="width:40%;">ファイル</th><th>使っている会員限定の記事</th><th>公開の場所</th></tr></thead>
			<tbody>
			<?php foreach ( array_slice( $skipped, 0, lw_member_files_admin_list_limit() ) as $item ) : ?>
				<tr>
					<td><?php lw_member_files_admin_file_cell( $item ); ?></td>
					<td><?php lw_member_files_admin_posts_cell( $item['posts'] ); ?></td>
					<td>
						<?php foreach ( $item['public'] as $label ) :
							list( $name, $url ) = lw_member_files_place_text( $label ); ?>
							<div><?php echo $url !== '' ? '<a href="' . esc_url( $url ) . '">' . esc_html( $name ) . '</a>' : esc_html( $name ); ?></div>
						<?php endforeach; ?>
					</td>
				</tr>
			<?php endforeach; ?>
			</tbody>
		</table>
		<?php lw_member_files_admin_more_note( count( $skipped ) ); ?>
	<?php endif; ?>
	<?php
}

/** ファイルの欄（1つ目のファイルへのリンク ＋ サイズ違いなどの数） */
function lw_member_files_admin_file_cell( array $item ) {
	$rel = $item['files'][0];
	echo '<a href="' . esc_url( lw_member_files_url( $rel ) ) . '" target="_blank" rel="noopener">' . esc_html( $rel ) . '</a>';
	if ( count( $item['files'] ) > 1 ) {
		echo '<br><span class="description">' . esc_html( sprintf( 'ほかにサイズ違いなど %d 個', count( $item['files'] ) - 1 ) ) . '</span>';
	}
}

/** 記事の欄（編集画面へのリンク） */
function lw_member_files_admin_posts_cell( array $post_ids ) {
	foreach ( array_slice( $post_ids, 0, 5 ) as $post_id ) {
		$title = get_the_title( $post_id );
		$link  = get_edit_post_link( $post_id, 'raw' );
		$title = $title !== '' ? $title : '（タイトルなし）';
		echo '<div>' . ( $link ? '<a href="' . esc_url( $link ) . '">' . esc_html( $title ) . '</a>' : esc_html( $title ) ) . '</div>';
	}
	if ( count( $post_ids ) > 5 ) {
		echo '<div class="description">' . esc_html( sprintf( 'ほか %d 件', count( $post_ids ) - 5 ) ) . '</div>';
	}
}

/** 表に出しきれなかったときの注記 */
function lw_member_files_admin_more_note( $total ) {
	if ( $total > lw_member_files_admin_list_limit() ) {
		echo '<p class="description">' . esc_html( sprintf( '最初の %d 件だけ表示しています。', lw_member_files_admin_list_limit() ) ) . '</p>';
	}
}
