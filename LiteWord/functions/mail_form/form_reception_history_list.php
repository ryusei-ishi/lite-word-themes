<?php
/**
 * LiteWord – 受信履歴一覧
 * ------------------------------------------------------------------
 * ・ページネーション対応（1ページ20件）
 * ・文字列検索機能
 * ・CSV ダウンロード（検索結果全体）- PHP直接処理
 * ・データをコピー（表示中のデータ）
 * ・行削除／全削除機能は維持
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/*──────────────────────────── 0. フォームセット番号 ───────────────────────────*/
$form_set_no = 0;
if ( isset( $args['form_set_no'] ) ) {
	$form_set_no = (int) $args['form_set_no'];
} elseif ( is_scalar( $args ) ) {
	$form_set_no = (int) $args;
}

// URLパラメータからも取得（検索・ページネーション用）
if ( isset( $_GET['form_reception_history_list'] ) ) {
	$form_set_no = (int) $_GET['form_reception_history_list'];
}

/*──────────────────────────── 1. パラメータ取得 ───────────────────────────*/
$per_page     = 20;  // 1ページあたりの表示件数
$current_page = isset( $_GET['paged'] ) ? max( 1, (int) $_GET['paged'] ) : 1;
$search_query = isset( $_GET['s'] ) ? trim( $_GET['s'] ) : '';

/*──────────────────────────── 2. DB から履歴を取得 ───────────────────────────*/
$rows         = [];
$record_total = 0;

if ( $form_set_no > 0 ) {
	global $wpdb;
	$table = $wpdb->prefix . 'lw_mail_reception_history';

	// 検索条件
	$where = $wpdb->prepare( "WHERE form_set_no = %d", $form_set_no );
	if ( $search_query !== '' ) {
		$like  = '%' . $wpdb->esc_like( $search_query ) . '%';
		$where .= $wpdb->prepare( " AND (body LIKE %s OR post_title LIKE %s)", $like, $like );
	}

	// 総件数取得
	$record_total = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table} {$where}" );

	// ページネーション用のデータ取得
	if ( $record_total > 0 ) {
		$offset = ( $current_page - 1 ) * $per_page;
		$rows   = $wpdb->get_results(
			"SELECT id, created_at, post_id, post_title, body
			   FROM {$table}
			   {$where}
			   ORDER BY id DESC
			   LIMIT {$per_page} OFFSET {$offset}"
		);
	}
}

/*──────────────────────────── 3. ページネーション計算 ───────────────────────────*/
$total_pages = $record_total > 0 ? ceil( $record_total / $per_page ) : 1;

/*──────────────────────────── 4. 共通変数 ───────────────────────────*/
$nonce = wp_create_nonce( 'lw_mail_hist_nonce' );
$adm_p = admin_url( 'admin-post.php' );

// 検索パラメータを保持したURL生成用
$base_url = add_query_arg( [
	'page' => 'lw_mail_form_set',
	'form_reception_history_list' => $form_set_no,
], admin_url( 'admin.php' ) );

if ( $search_query !== '' ) {
	$base_url = add_query_arg( 's', urlencode( $search_query ), $base_url );
}

// CSV ダウンロード URL
$csv_download_url = wp_nonce_url(
	add_query_arg(
		[
			'action'      => 'lw_mail_download_csv',
			'form_set_no' => $form_set_no,
			'search'      => $search_query,
		],
		admin_url( 'admin-post.php' )
	),
	'lw_mail_csv_download'
);
?>
<style>
/* ページネーションのスタイル */
.lw-pagination {
	margin: 12px 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	margin: 20px 0;
	padding: 10px 0;
}
.lw-pagination a,
.lw-pagination span {
	display: inline-block;
	padding: 6px 12px;
	border: 1px solid #ddd;
	background: #fff;
	color: #2271b1;
	text-decoration: none;
	border-radius: 3px;
	transition: all 0.2s;
}
.lw-pagination a:hover {
	background: #f0f0f1;
	border-color: #2271b1;
}
.lw-pagination .current {
	background: #2271b1;
	color: #fff;
	border-color: #2271b1;
	font-weight: bold;
}
.lw-pagination .dots {
	border: none;
	background: transparent;
	color: #666;
}
.lw-pagination .prev,
.lw-pagination .next {
	font-weight: bold;
}
.lw-search-form {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 20px;
}
.lw-search-form input[type="text"] {
	width: 300px;
	padding: 6px 12px;
}
.lw-search-keyword {
	margin-top: 8px;
	color: #666;
}
.lw-search-keyword strong {
	color: #000;
}
</style>

<div class="lw_mail_form_wrap reset bg_color">
	<?= lw_mail_set_header( "問合せフォーム {$form_set_no} 「受信履歴」", "null" ); ?>
	<?= lw_mail_set_tab_menu( $form_set_no ); ?>

	<div class="mail_history_wrap">
<?php
/*━━━━━━━━━━ ケース分岐 ━━━━━━━━━━*/
if ( $form_set_no <= 0 ) {

	echo '<p style="color:red;">フォームセット番号が取得できません。</p>';

} else { ?>

		<!-- 検索フォーム -->
		<form method="get" action="<?= esc_url( admin_url( 'admin.php' ) ); ?>" class="lw-search-form">
			<input type="hidden" name="page" value="lw_mail_form_set">
			<input type="hidden" name="form_reception_history_list" value="<?= esc_attr( $form_set_no ); ?>">
			
			<input type="text" 
			       name="s" 
			       value="<?= esc_attr( $search_query ); ?>" 
			       placeholder="検索ワードを入力...">
			
			<button type="submit" class="button">検索</button>
			
			<?php if ( $search_query !== '' ) : ?>
				<a href="<?= esc_url( remove_query_arg( 's', $base_url ) ); ?>" 
				   class="button">
					検索解除
				</a>
			<?php endif; ?>
		</form>
		
		<?php if ( $search_query !== '' ) : ?>
			<p class="lw-search-keyword">
				検索ワード：<strong><?= esc_html( $search_query ); ?></strong>
			</p>
		<?php endif; ?>

		<!-- アクションボタン -->
		<p style="margin:16px 0;">
			<a href="<?= esc_url( $csv_download_url ); ?>"
			   class="button"
			   <?= $record_total === 0 ? 'style="pointer-events:none;opacity:0.5;"' : ''; ?>>
				CSV ダウンロード<?= $search_query !== '' ? '（検索結果 全' . number_format($record_total) . '件）' : ''; ?>
			</a>

			<button id="jsCopyTbl"
			        class="button"
			        style="margin-left:8px;"
			        <?= $record_total === 0 ? 'disabled' : ''; ?>>
				データをコピー（表示中）
			</button>

			<a class="button"
			   style="margin-left:8px;background:#dc3232;color:#fff;<?= $record_total === 0 ? 'pointer-events:none;opacity:0.5;' : ''; ?>"
			   href="<?= esc_url(
				   wp_nonce_url(
					   add_query_arg(
						   [
							   'action'      => 'lw_mail_del_all',
							   'form_set_no' => $form_set_no
						   ],
						   $adm_p
					   ),
					   'lw_mail_hist_nonce'
				   )
			   ); ?>"
			   onclick="return confirm('<?= $search_query !== '' ? '検索結果を含む' : ''; ?>すべて削除します。よろしいですか？');">
				データを全て削除
			</a>

			<span style="margin-left:16px;font-weight:bold;">
				全 <?= esc_html( number_format( $record_total ) ); ?> 件
				<?php if ( $total_pages > 1 ) : ?>
					（<?= esc_html( $current_page ); ?> / <?= esc_html( $total_pages ); ?> ページ）
				<?php endif; ?>
			</span>
		</p>

<?php if ( ! $record_total ) { ?>
		<p style="margin-top:16px;">
			<?= $search_query !== '' ? '検索結果が見つかりませんでした。' : '受信履歴がありません。'; ?>
		</p>
<?php } else { ?>

		<!-- ページネーション（上） -->
		<?php if ( $total_pages > 1 ) : 
			echo lw_mail_custom_pagination( $current_page, $total_pages, $base_url );
		endif; ?>

		<!-- データリスト -->
		<ul class="lw_mail_history_list">
<?php
	foreach ( $rows as $r ) :

		$created = mysql2date( 'Y-m-d H:i:s', $r->created_at );
		$post    = $r->post_id ? "{$r->post_id}：{$r->post_title}" : '-';

		$body_arr = json_decode( $r->body, true ) ?: [];
		unset( $body_arr['lw_current_post_id'] );
?>
			<li class="lw_mail_history_item">
				<div class="td small">
					<a class="button btn_delete small"
					   href="<?= esc_url(
						   wp_nonce_url(
							   add_query_arg(
								   [
									   'action'      => 'lw_mail_del_row',
									   'row_id'      => $r->id,
									   'form_set_no' => $form_set_no
								   ],
								   $adm_p
							   ),
							   'lw_mail_hist_nonce'
						   )
					   ); ?>"
					   onclick="return confirm('この行を削除しますか？');">
						削除
					</a>
				</div>

				<div class="td">
					<span class="text">
						<?= esc_html( $post ); ?><br>
						<?= esc_html( $created ); ?>
					</span>
				</div>
<?php
		foreach ( $body_arr as $label => $value ) :

			if ( is_array( $value ) ) {
				$value = implode( ', ', $value );
			}
?>
				<div class="td">
					<span class="label"><?= esc_html( $label ); ?></span>
					<span class="text"><?= nl2br( esc_html( $value ) ); ?></span>
				</div>
<?php
		endforeach; ?>
			</li>
<?php
	endforeach; ?>
		</ul>

		<!-- ページネーション（下） -->
		<?php if ( $total_pages > 1 ) : 
			echo lw_mail_custom_pagination( $current_page, $total_pages, $base_url );
		endif; ?>

<?php
} // 件数チェック End ?>
<?php
} // フォームセット番号チェック End ?>
	</div><!-- /.mail_history_wrap -->
</div><!-- /.lw_mail_form_wrap -->

<!--────────────────────────── JS : 表示中データをコピー ──────────────────────────-->
<script>
(() => {

	/*──────────────── データをコピー（表示中のデータのみ） ──*/
	const cpBtn = document.getElementById('jsCopyTbl');
	if ( cpBtn ) {
		cpBtn.addEventListener('click', async () => {
			cpBtn.disabled = true;
			const origText = cpBtn.textContent;
			cpBtn.textContent = 'コピー中…';
			
			try {
				const items = document.querySelectorAll('.lw_mail_history_item');
				if ( ! items.length ) throw new Error('データがありません。');

				let maxFields = 0;
				const rows = [];

				items.forEach(li => {
					const tds = li.querySelectorAll('.td');
					if ( tds.length < 2 ) return;

					// post と created_at の取得（<br>を改行に変換）
					const infoHtml = tds[1].querySelector('.text').innerHTML;
					const info = infoHtml.split(/<br\s*\/?>/i);
					const post = (info[0] || '').replace(/<[^>]+>/g, '').trim();
					const created = (info[1] || '').replace(/<[^>]+>/g, '').trim();

					// フィールド値の取得（<br>を改行に変換）
					const vals = [];
					for ( let i = 2; i < tds.length; i++ ) {
						const txt = tds[i].querySelector('.text');
						if ( txt ) {
							// HTMLから<br>を改行に変換し、他のタグを除去
							const val = txt.innerHTML
								.replace(/<br\s*\/?>/gi, '\n')
								.replace(/<[^>]+>/g, '')
								.trim();
							vals.push(val);
						}
					}
					maxFields = Math.max(maxFields, vals.length);
					rows.push({ post, created, vals });
				});

				// ヘッダー
				const header = ['post', 'created_at'];
				for ( let i = 1; i <= maxFields; i++ ) header.push(`field_${i}`);

				// TSV 生成（改行を保持）
				const tsvArr = [header];
				rows.forEach(r => {
					while (r.vals.length < maxFields) r.vals.push('');
					tsvArr.push([r.post, r.created, ...r.vals]);
				});

				// TSV: タブ区切り、値内の改行は保持、タブは空白に置換
				const tsvStr = tsvArr
					.map(a => a.map(v => String(v || '').replace(/\t/g, ' ')).join('\t'))
					.join('\n');

				// HTML table 生成（改行を<br>に変換）
				let html = '<table><thead><tr>';
				header.forEach(h => html += `<th>${h}</th>`);
				html += '</tr></thead><tbody>';
				rows.forEach(r => {
					html += '<tr>';
					const arr = [r.post, r.created, ...r.vals];
					while (arr.length < header.length) arr.push('');
					arr.forEach(v => {
						const escaped = String(v || '')
							.replace(/&/g, '&amp;')
							.replace(/</g, '&lt;')
							.replace(/>/g, '&gt;')
							.replace(/\n/g, '<br>');
						html += `<td>${escaped}</td>`;
					});
					html += '</tr>';
				});
				html += '</tbody></table>';

				// クリップボードにコピー
				if (navigator.clipboard && window.ClipboardItem) {
					const data = {
						'text/html' : new Blob([html], {type:'text/html'}),
						'text/plain': new Blob([tsvStr], {type:'text/plain'})
					};
					await navigator.clipboard.write([new ClipboardItem(data)]);
				} else {
					await navigator.clipboard.writeText(tsvStr);
				}
				
				alert('表示中のデータ（' + rows.length + '件）をコピーしました。');

			} catch(e) {
				alert('エラー: ' + e.message);
				console.error('Copy Error:', e);
			} finally {
				cpBtn.disabled = false;
				cpBtn.textContent = origText;
			}
		});
	}

})();
</script>

<?php
/**
 * カスタムページネーション関数
 */
function lw_mail_custom_pagination( $current, $total, $base_url ) {
	if ( $total <= 1 ) return '';

	$output = '<div class="lw-pagination">';

	// 前へ
	if ( $current > 1 ) {
		$prev_url = add_query_arg( 'paged', $current - 1, $base_url );
		$output .= '<a href="' . esc_url( $prev_url ) . '" class="prev">« 前へ</a>';
	}

	// ページ番号の表示範囲を計算
	$range = 2; // 現在のページの前後に表示する数
	$start = max( 1, $current - $range );
	$end   = min( $total, $current + $range );

	// 最初のページ
	if ( $start > 1 ) {
		$output .= '<a href="' . esc_url( $base_url ) . '">1</a>';
		if ( $start > 2 ) {
			$output .= '<span class="dots">...</span>';
		}
	}

	// 中間のページ
	for ( $i = $start; $i <= $end; $i++ ) {
		if ( $i == $current ) {
			$output .= '<span class="current">' . $i . '</span>';
		} else {
			$page_url = ( $i == 1 ) ? $base_url : add_query_arg( 'paged', $i, $base_url );
			$output .= '<a href="' . esc_url( $page_url ) . '">' . $i . '</a>';
		}
	}

	// 最後のページ
	if ( $end < $total ) {
		if ( $end < $total - 1 ) {
			$output .= '<span class="dots">...</span>';
		}
		$last_url = add_query_arg( 'paged', $total, $base_url );
		$output .= '<a href="' . esc_url( $last_url ) . '">' . $total . '</a>';
	}

	// 次へ
	if ( $current < $total ) {
		$next_url = add_query_arg( 'paged', $current + 1, $base_url );
		$output .= '<a href="' . esc_url( $next_url ) . '" class="next">次へ »</a>';
	}

	$output .= '</div>';

	return $output;
}
?>