<?php
/**
 * LiteWord – Profile Manager (管理画面)
 * ------------------------------------------------------------
 * "ユーザー › プロフィール管理" 専用 UI / JS / CSS
 * プロフィール編集画面へのフィールド追加・保存
 * ------------------------------------------------------------
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/* =============================================================
 * 0) 定数・共通関数
 * =========================================================== */
const LW_PM_OPTION_KEY = 'lw_pm_profile_fields';
const LW_PM_SLUG       = 'lw-pm-profile-manager';

/** users.php?page=lw-pm-profile-manager か？ */
function lw_pm_is_manager_page(): bool {
	global $pagenow;
	return is_admin() && $pagenow === 'users.php' && ( $_GET['page'] ?? '' ) === LW_PM_SLUG;
}

/* =============================================================
 * 1) メニュー追加
 * =========================================================== */
add_action( 'admin_menu', function () {
	add_submenu_page(
		'users.php',
		'プロフィール管理',
		'プロフィール管理',
		'manage_options',
		LW_PM_SLUG,
		'lw_pm_render_admin_page',
		99
	);
} );

/* =============================================================
 * 2) 管理ページ描画 & 保存
 * =========================================================== */
function lw_pm_render_admin_page() {

	/* ---------- 保存処理 ---------- */
	if ( isset( $_POST['lw_pm_nonce'] ) && wp_verify_nonce( $_POST['lw_pm_nonce'], 'lw_pm_save' ) ) {

		$new_fields  = [];
		$meta_keep   = [];
		$heading_i   = 1;
		$para_i      = 1;
		$used_names  = [];

		$labels  = $_POST['label']   ?? [];
		$names   = $_POST['name']    ?? [];
		$types   = $_POST['type']    ?? [];
		$options = $_POST['options'] ?? [];
		$notes   = $_POST['note']    ?? [];
		$orders  = $_POST['order']   ?? [];

		foreach ( $labels as $i => $lab_raw ) {

			$type  = sanitize_key( $types[ $i ] ?? '' );
			$label = sanitize_text_field( $lab_raw );
			$name  = sanitize_key( $names[ $i ] ?? '' );
			$opt   = sanitize_textarea_field( $options[ $i ] ?? '' );
			$note  = sanitize_textarea_field( $notes[ $i ] ?? '' );
			$order = intval( $orders[ $i ] ?? 0 );

			/* === 見出し・段落：自動で固定名 === */
			if ( in_array( $type, [ 'heading_h2', 'heading_h3' ], true ) ) {
				$name = 'heading_' . $heading_i++;
			} elseif ( $type === 'paragraph' ) {
				$name = 'paragraph_' . $para_i++;
			}

			/* === その他：空欄なら label から自動生成 === */
			if ( $name === '' ) {
				$base = sanitize_key( $label );
				if ( $base === '' ) $base = 'field';

				$name = $base;
				$n    = 2;
				while ( in_array( $name, $used_names, true ) ) {
					$name = $base . '_' . $n++;
				}
			}

			$used_names[] = $name;

			/* 空欄 label は許可しないが、name が自動生成された場合は OK */
			if ( $label === '' && ! in_array( $type, [ 'heading_h2', 'heading_h3', 'paragraph' ], true ) ) continue;

			$new_fields[] = compact( 'label', 'name', 'type', 'opt', 'note', 'order' );

			/* user_meta を残す対象 */
			if ( ! in_array( $type, [ 'heading_h2', 'heading_h3', 'paragraph' ], true ) ) $meta_keep[] = $name;
		}
		usort( $new_fields, fn( $a, $b ) => $a['order'] <=> $b['order'] );

		/* user_meta クリーンアップ */
		$old = array_column( get_option( LW_PM_OPTION_KEY, [] ), 'name' );
		$del = array_diff( $old, $meta_keep );
		if ( $del ) foreach ( get_users( [ 'fields' => 'ID' ] ) as $u )
			foreach ( $del as $k ) delete_user_meta( $u, $k );

		update_option( LW_PM_OPTION_KEY, $new_fields );
		echo '<div class="updated"><p>保存しました。</p></div>';
	}

	$fields = get_option( LW_PM_OPTION_KEY, [] );

	/* ---------- 画面 ---------- */
	?>
	<div class="wrap">
		<h1 class="wp-heading-inline">プロフィール管理</h1>
		<p class="description" style="margin-top:10px;">プロフィールに表示するフィールドを管理します。見出しや段落も追加できます。</p>

		<form method="post" id="lw-pm-fields-form">
			<?php wp_nonce_field( 'lw_pm_save', 'lw_pm_nonce' ); ?>

			<table class="widefat" id="lw-pm-fields-table">
				<thead>
					<tr>
						<th>ラベル / 見出し</th>
						<th>name</th>
						<th>タイプ</th>
						<th>option / 段落本文<br><small>(1行=1項目)&nbsp;+&nbsp;補足テキスト</small></th>
						<th>並び順</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<?php
					if ( $fields ) foreach ( $fields as $f ) lw_pm_row( $f );
					else lw_pm_row(); // 雛形
					?>
				</tbody>
			</table>

			<p style="margin-top:15px;">
				<button type="button" class="button" id="lw-pm-add-row">+ 行を追加</button>
			</p>
			<?php submit_button( '保存' ); ?>
		</form>
	</div>
	<?php
}

/* ===== 行テンプレート ===== */
function lw_pm_row( $f = [] ) {

	$label = $f['label'] ?? '';
	$name  = $f['name']  ?? '';
	$type  = $f['type']  ?? 'text';
	$opt   = $f['opt']   ?? '';  // options
	$note  = $f['note']  ?? '';
	$order = $f['order'] ?? 0;

	$types = [
		'text'       => '1行テキスト',
		'textarea'   => 'テキストエリア',
		'select'     => '選択肢',
		'heading_h2' => '見出し (h2)',
		'heading_h3' => '見出し (h3)',
		'paragraph'  => '段落 (静的)',
	];
	?>
	<tr>
		<td><input type="text" name="label[]" value="<?= esc_attr( $label ); ?>" class="regular-text" placeholder="ラベル名"></td>

		<td><input type="text" name="name[]"  value="<?= esc_attr( $name ); ?>"  class="regular-text" placeholder="フィールド名"></td>

		<td>
			<select name="type[]" class="lw-pm-type-select">
				<?php foreach ( $types as $k => $v ) : ?>
					<option value="<?= esc_attr( $k ); ?>" <?= selected( $type, $k, false ); ?>><?= esc_html( $v ); ?></option>
				<?php endforeach; ?>
			</select>
		</td>

		<td>
			<textarea name="options[]" rows="3" placeholder="選択肢 or 段落本文"><?= esc_textarea( $opt ); ?></textarea>
			<textarea name="note[]" rows="1" placeholder="補足テキスト (任意)"><?= esc_textarea( $note ); ?></textarea>
		</td>

		<td><input type="number" name="order[]" value="<?= esc_attr( $order ); ?>"></td>

		<td>
			<button type="button" class="button lw-pm-row-up" title="上へ移動">↑</button>
			<button type="button" class="button lw-pm-row-down" title="下へ移動">↓</button>
			<button type="button" class="button lw-pm-row-del" title="削除">✕</button>
		</td>
	</tr>
	<?php
}

/* =============================================================
 * 3) 管理ページ専用 CSS & JS
 * =========================================================== */
add_action( 'admin_footer', function () {

	if ( ! lw_pm_is_manager_page() ) return; ?>

	<!-- ==== CSS ==== -->
	<style id="lw-pm-admin-css">
		/* テーブル全体 */
		#lw-pm-fields-table {
			table-layout: fixed;
			width: 100%;
			margin-top: 20px;
			background: #fff;
			border: 1px solid #c3c4c7;
			box-shadow: 0 1px 1px rgba(0,0,0,0.04);
		}
		
		/* ヘッダー */
		#lw-pm-fields-table thead th {
			background: #f6f7f7;
			font-weight: 600;
			padding: 10px 12px;
			border-bottom: 2px solid #c3c4c7;
		}
		
		/* セル */
		#lw-pm-fields-table td {
			padding: 12px;
			vertical-align: top;
			border-bottom: 1px solid #dcdcde;
		}
		
		#lw-pm-fields-table tbody tr:hover {
			background: #f6f7f7;
		}
		
		/* 列幅 */
		#lw-pm-fields-table th:nth-child(1), td:nth-child(1) { width: 180px; }
		#lw-pm-fields-table th:nth-child(2), td:nth-child(2) { width: 120px; }
		#lw-pm-fields-table th:nth-child(3), td:nth-child(3) { width: 110px; }
		#lw-pm-fields-table th:nth-child(4), td:nth-child(4) { width: 280px; }
		#lw-pm-fields-table th:nth-child(5), td:nth-child(5) { width: 80px; text-align: center; }
		#lw-pm-fields-table th:nth-child(6), td:nth-child(6) { width: 110px; text-align: center; }
		
		/* 入力フィールド */
		#lw-pm-fields-table input[type="text"],
		#lw-pm-fields-table input[type="number"],
		#lw-pm-fields-table select {
			width: 100%;
			max-width: 100%;
			box-sizing: border-box;
		}
		
		#lw-pm-fields-table input[type="number"] {
			width: 60px;
			text-align: center;
		}
		
		#lw-pm-fields-table textarea {
			width: 100%;
			min-height: 50px;
			resize: vertical;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
			font-size: 13px;
			line-height: 1.5;
			padding: 6px 8px;
			border: 1px solid #8c8f94;
			border-radius: 4px;
			box-sizing: border-box;
		}
		
		#lw-pm-fields-table textarea[name="note[]"] {
			margin-top: 6px;
			min-height: 32px;
			font-size: 12px;
			border-color: #c3c4c7;
		}
		
		#lw-pm-fields-table textarea:focus {
			border-color: #2271b1;
			box-shadow: 0 0 0 1px #2271b1;
			outline: none;
		}
		
		/* ボタン */
		#lw-pm-fields-table .button {
			padding: 4px 8px;
			min-width: 32px;
			height: 32px;
			margin: 0 2px;
		}
		
		#lw-pm-add-row {
			padding: 8px 16px;
		}
		
		/* select */
		#lw-pm-fields-table select {
			height: 32px;
		}
	</style>

	<!-- ==== JS ==== -->
	<script>
	document.addEventListener('DOMContentLoaded', () => {

		const tbody  = document.querySelector('#lw-pm-fields-table tbody');
		const addBtn = document.getElementById('lw-pm-add-row');
		const form   = document.getElementById('lw-pm-fields-form');

		if (!tbody || !addBtn || !form) return;

		/* === 行追加 === */
		addBtn.addEventListener('click', () => {
			const tmpl = tbody.rows[0];
			if (!tmpl) return;
			const row = tmpl.cloneNode(true);

			row.querySelectorAll('input,select,textarea').forEach(el=>{
				if(el.tagName==='SELECT') el.selectedIndex = 0;
				else el.value = '';
			});
			tbody.appendChild(row);
			updateOrder(); toggleAll();
		});

		/* === 行操作 === */
		tbody.addEventListener('click', e => {
			const btn = e.target.closest('.button'); if(!btn) return;
			const row = btn.closest('tr');
			if(btn.classList.contains('lw-pm-row-up')){
				const prev = row.previousElementSibling; if(prev) tbody.insertBefore(row, prev);
			}else if(btn.classList.contains('lw-pm-row-down')){
				const next = row.nextElementSibling; if(next) tbody.insertBefore(next, row);
			}else if(btn.classList.contains('lw-pm-row-del')){
				if(tbody.rows.length>1) row.remove(); else alert('少なくとも1行は残してください。');
			}
			updateOrder();
		});

		/* === type 切替で表示制御 === */
		tbody.addEventListener('change', e => {
			if (e.target.matches('.lw-pm-type-select')) toggleRow(e.target.closest('tr'));
		});

		function toggleRow(tr){
			const type = tr.querySelector('.lw-pm-type-select').value;

			const taOpt  = tr.querySelector('textarea[name="options[]"]');
			const taNote = tr.querySelector('textarea[name="note[]"]');

			// options: select or paragraph の時だけ表示
			taOpt.style.display  = (type === 'select' || type === 'paragraph') ? '' : 'none';
			// note: heading 系 または paragraph の時は非表示
			taNote.style.display = (type.startsWith('heading_') || type === 'paragraph') ? 'none' : '';
		}
		function toggleAll(){ Array.from(tbody.rows).forEach(toggleRow); }
		toggleAll();

		form.addEventListener('submit', updateOrder);
		function updateOrder(){
			Array.from(tbody.rows).forEach((tr,i)=>tr.querySelector('input[name="order[]"]').value=i+1);
		}
	});
	</script>
<?php } );

/* =============================================================
 * 4) プロフィール編集画面 追加/保存
 * =========================================================== */
add_action( 'show_user_profile',        'lw_pm_edit_fields' );
add_action( 'edit_user_profile',        'lw_pm_edit_fields' );
add_action( 'personal_options_update',  'lw_pm_save_fields' );
add_action( 'edit_user_profile_update', 'lw_pm_save_fields' );

function lw_pm_edit_fields( $user ) {
	$fields = get_option( LW_PM_OPTION_KEY, [] ); if( ! $fields ) return;

	echo '<h2>カスタムプロフィール</h2>';
	echo '<table class="form-table" role="presentation">';
	foreach ( $fields as $f ) {
		switch ( $f['type'] ) {

			case 'heading_h2':
			case 'heading_h3':
				$tag = $f['type'] === 'heading_h2' ? 'h2' : 'h3';
				echo '<tr><th colspan="2" style="padding-top:20px;"><' . $tag . ' style="margin:0;">' . esc_html( $f['label'] ) . '</' . $tag . '></th></tr>';
				if ( $f['note'] !== '' ) echo '<tr><td colspan="2" style="padding-top:0;"><p style="margin:5px 0;">' . nl2br( esc_html( $f['note'] ) ) . '</p></td></tr>';
				break;

			case 'paragraph':
				echo '<tr><td colspan="2" style="padding:12px 0;"><p style="margin:0;">' . nl2br( esc_html( $f['opt'] ?? '' ) ) . '</p>';
				if ( $f['note'] !== '' ) echo '<p class="description" style="margin:8px 0 0;">' . nl2br( esc_html( $f['note'] ) ) . '</p>';
				echo '</td></tr>';
				break;

			default:
				$val = get_user_meta( $user->ID, $f['name'], true );
				echo '<tr><th scope="row"><label for="' . esc_attr( $f['name'] ) . '">' . esc_html( $f['label'] ) . '</label></th><td>';

				if ( $f['type'] === 'textarea' ) {
					echo '<textarea name="' . esc_attr( $f['name'] ) . '" id="' . esc_attr( $f['name'] ) . '" rows="5" cols="30" class="regular-text">' . esc_textarea( $val ) . '</textarea>';

				} elseif ( $f['type'] === 'select' ) {
					$opts = array_filter( array_map( 'trim', explode( "\n", $f['opt'] ?? '' ) ) );
					echo '<select name="' . esc_attr( $f['name'] ) . '" id="' . esc_attr( $f['name'] ) . '"><option value="">— 選択 —</option>';
					foreach ( $opts as $o ) echo '<option value="' . esc_attr( $o ) . '" ' . selected( $val, $o, false ) . '>' . esc_html( $o ) . '</option>';
					echo '</select>';

				} else { // text
					echo '<input type="text" name="' . esc_attr( $f['name'] ) . '" id="' . esc_attr( $f['name'] ) . '" value="' . esc_attr( $val ) . '" class="regular-text">';
				}

				if ( $f['note'] !== '' ) echo '<p class="description" style="margin-top:8px;">' . nl2br( esc_html( $f['note'] ) ) . '</p>';
				echo '</td></tr>';
		}
	}
	echo '</table>';
}

function lw_pm_save_fields( $user_id ) {
	if ( ! current_user_can( 'edit_user', $user_id ) ) return;
	foreach ( get_option( LW_PM_OPTION_KEY, [] ) as $f ) {
		if ( in_array( $f['type'], [ 'heading_h2', 'heading_h3', 'paragraph' ], true ) ) continue;
		if ( isset( $_POST[ $f['name'] ] ) ) {
			update_user_meta( $user_id, $f['name'], sanitize_textarea_field( wp_unslash( $_POST[ $f['name'] ] ) ) );
		}
	}
}
?>