<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/* ─────────────────────────────
 * WordPress標準のサニタイズ関数
 * ─────────────────────────── */
if ( ! function_exists( 'sanitize_text_field' ) ) {
	function sanitize_text_field( $str ) { return filter_var( $str, FILTER_SANITIZE_STRING ); }
}

/* ─────────────────────────────
 * 1) フォームセットのIDを決定
 * ─────────────────────────── */
$form_set_no = sanitize_text_field( $args );

/* ─────────────────────────────
 * 2) 初期データ
 *    ★ shortcode キーを追加
 * ─────────────────────────── */
$default_data = [
	[
		'select_pattern' => 'name',
		'required'       => true,
		'label_text'     => 'お名前',
		'option'         => "オプションテキスト1\nオプションテキスト2\nオプションテキスト3",
		'supplement_text'=> '例）山田太郎',
		'placeholder'    => '',
		'shortcode'      => 'your_name',
	],
	[
		'select_pattern' => 'email',
		'required'       => true,
		'label_text'     => 'メールアドレス',
		'option'         => "オプションテキスト1\nオプションテキスト2\nオプションテキスト3",
		'supplement_text'=> '例）sample@gmail.com',
		'placeholder'    => '',
		'shortcode'      => 'your_mail',
	],
	[
		'select_pattern' => 'textarea',
		'required'       => false,
		'label_text'     => 'お問合せ内容',
		'option'         => "オプションテキスト1\nオプションテキスト2\nオプションテキスト3",
		'supplement_text'=> '',
		'placeholder'    => '',
		'shortcode'      => 'your_message',
	],
];

/* ─────────────────────────────
 * 3) POSTされていれば保存
 * ─────────────────────────── */
if (
	isset( $_POST['form_set_no'] )       && $_POST['form_set_no']       !== '' &&
	isset( $_POST['form_set_item_arr'] ) && $_POST['form_set_item_arr'] !== ''
) {
	$form_set_item_arr = wp_unslash( $_POST['form_set_item_arr'] );
	update_option( "lw_mail_form_set_" . $form_set_no, $form_set_item_arr );
}

/* ─────────────────────────────
 * 4) DBに保存してあるJSON文字列を取得
 *    未保存の場合は $default_data を利用
 * ─────────────────────────── */
$saved_data = get_option( "lw_mail_form_set_" . $form_set_no, false );
if ( $saved_data ) {
	$saved_data = json_decode( $saved_data, true );
}
if ( ! is_array( $saved_data ) ) {
	$saved_data = $default_data;
}
?>
<div class="none_plugin_message"></div>
<div class="lw_mail_form_wrap reset">
	<?= lw_mail_set_header( "問合せフォーム $form_set_no 「入力項目の設定」","submit" , "変更内容を保存する" , "" ,"1" ); ?>
	<?= lw_mail_set_tab_menu( $form_set_no ); ?>
	<div class="lw_mail_form_set_wrap bg_color">
		<form class="mail_form_set" id="lw_mail_form_set" action="" method="post">
			<div class="toggle_all_btns">
				<button type="button" class="toggle_all_btn" id="expand_all_btn">全て開く</button>
				<button type="button" class="toggle_all_btn" id="collapse_all_btn">全て閉じる</button>
			</div>
			<div class="items"></div>

			<div class="add_item_btn">項目の追加 +</div>

			<!-- フォームセット番号 -->
			<input type="hidden" name="form_set_no" value="<?php echo esc_attr( $form_set_no ); ?>">

			<!-- DBまたは初期値から得た配列を JSON にして hidden に埋め込む -->
			<input
				type="hidden"
				name="form_set_item_arr"
				value="<?php echo esc_attr( json_encode( $saved_data ) ); ?>"
			>

			<input type="submit" value="変更内容を保存する" class="Lw_mail_setting_form_submit">
		</form>
	</div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {

	/* ─────────────────────────────
	 * 要素取得
	 * ─────────────────────────── */
	const lw_mail_form_set    = document.getElementById('lw_mail_form_set');
	if (!lw_mail_form_set) return;

	const itemsContainer      = lw_mail_form_set.querySelector('.items');
	const formSetItemArrInput = lw_mail_form_set.querySelector('input[name="form_set_item_arr"]');
	const addItemBtn          = lw_mail_form_set.querySelector('.add_item_btn');

	/* ─────────────────────────────
	 * hidden の JSON をパース
	 * ─────────────────────────── */
	let item_arr_data = [];
	try { item_arr_data = JSON.parse(formSetItemArrInput.value) || []; } catch(e) {}

	/* ─────────────────────────────
	 * select_pattern 選択肢
	 * ─────────────────────────── */
	const options = [
		{ value:'',         label:'未選択' },
		{ value:'name',     label:'お名前' },
		{ value:'phone',    label:'電話番号' },
		{ value:'email',    label:'メールアドレス' },
		{ value:'text',     label:'１行テキスト' },
		{ value:'textarea', label:'テキストエリア' },
		{ value:'radio',    label:'ラジオボタン' },
		{ value:'checkbox', label:'チェックボックス' },
		{ value:'select',   label:'セレクトボックス' },
		{ value:'image',    label:'画像アップロード' },
		{ value:'date',     label:'日付' },
		{ value:'time',     label:'時間' },
	];

	/* ─────────────────────────────
	 * 既存ショートコード一覧を取得
	 * ─────────────────────────── */
	const collectShortcodes = () =>
		[...itemsContainer.querySelectorAll('input[name="shortcode"]')]
			.map(el => el.value);

	/* ─────────────────────────────
	 * ユニークなショートコード生成
	 * ─────────────────────────── */
	const generateUniqueShortcode = () => {
		let code;
		const existing = collectShortcodes();
		do {
			code = 'sc_' + Math.random().toString(36).slice(2, 8);
		} while (existing.includes(code));
		return code;
	};

	/* ─────────────────────────────
	 * hidden 更新
	 * ─────────────────────────── */
	const updateItemArray = () => {
		const formItems = itemsContainer.querySelectorAll('.form_item');
		const newArr    = [];

		formItems.forEach(item => {
			newArr.push({
				select_pattern : item.querySelector('[name="select_pattern"]')?.value || '',
				required       : item.querySelector('[name="required"]')?.checked || false,
				label_text     : item.querySelector('[name="label_text"]')?.value || '',
				option         : item.querySelector('[name="option_text"]')?.value || '',
				supplement_text: item.querySelector('[name="supplement_text"]')?.value || '',
				placeholder    : item.querySelector('[name="placeholder"]')?.value || '',
				shortcode      : item.querySelector('[name="shortcode"]')?.value || '',
			});
		});
		formSetItemArrInput.value = JSON.stringify(newArr);
	};

	/* ─────────────────────────────
	 * option_section の表示切替
	 * ─────────────────────────── */
	const toggleOptionSection = formItemEl => {
		const selectEl       = formItemEl.querySelector('[name="select_pattern"]');
		const optionSections = formItemEl.querySelectorAll('.option_section');
		if (!selectEl) return;
		if (['radio','checkbox','select'].includes(selectEl.value)) {
			optionSections.forEach(el => el.style.display = 'block');
		} else {
			optionSections.forEach(el => el.style.display = 'none');
		}
	};

	/* ─────────────────────────────
	 * 項目追加
	 * ─────────────────────────── */
	const addItem = (data = {}) => {

		const optionsHTML = options.map(o =>
			`<option value="${o.value}">${o.label}</option>`
		).join('');

		const newItem = document.createElement('div');
		newItem.classList.add('form_item');
		newItem.setAttribute('draggable', 'true');
		newItem.innerHTML = `
			<div class="item_header">
				<div class="drag_handle" title="ドラッグして移動">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width:16px;height:16px;fill:#666;"><path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"/></svg>
				</div>
				<div class="item_title_display">項目タイトル</div>
				<div class="toggle_item_btn" title="開閉">▼</div>
			</div>
			<div class="item_content">
				<dl class="in">
					<div class="ctrl_btns_wrap">
						<div class="move_btn_wrap">
							<div class="move_btn move_up">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8h256c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>
							</div>
							<div class="move_btn move_down">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8h256c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>
							</div>
						</div>
						<div class="delete_btn">この項目を削除</div>
					</div>

					<dt>項目タイトル</dt>
					<dd><textarea name="label_text" rows="2"></textarea></dd>

					<dt>タイプの選択</dt>
					<dd><select name="select_pattern">${optionsHTML}</select></dd>

					<dt>必須項目</dt>
					<dd><input type="checkbox" name="required"></dd>

					<dt class="option_section" style="display:none;">選択肢 (改行区切り)</dt>
					<dd class="option_section" style="display:none;"><textarea name="option_text" rows="5"></textarea></dd>

					<dt>補足テキスト</dt>
					<dd><textarea name="supplement_text" rows="2"></textarea></dd>

					<dt>プレースホルダ</dt>
					<dd><input type="text" name="placeholder" value=""></dd>

					<!-- ★ ショートコード -->
					<dt>ショートコード</dt>
					<dd><input type="text" name="shortcode" value=""></dd>
				</dl>
			</div>
		`;
		itemsContainer.appendChild(newItem);

		/* 初期値セット */
		newItem.querySelector('[name="select_pattern"]').value =
			data.select_pattern || '';

		newItem.querySelector('[name="required"]').checked =
			!!data.required;

		newItem.querySelector('[name="label_text"]').value =
			data.label_text || '';

		newItem.querySelector('[name="option_text"]').value =
			data.option || '';

		newItem.querySelector('[name="supplement_text"]').value =
			data.supplement_text || '';

		newItem.querySelector('[name="placeholder"]').value =
			data.placeholder || '';

		const scInput = newItem.querySelector('[name="shortcode"]');
		scInput.value = data.shortcode || generateUniqueShortcode();

		/* select に応じた表示切替 */
		toggleOptionSection(newItem);

		/* タイトル表示の更新 */
		const updateTitleDisplay = () => {
			const labelText = newItem.querySelector('[name="label_text"]').value || '項目タイトル';
			newItem.querySelector('.item_title_display').textContent = labelText;
		};
		updateTitleDisplay();
		newItem.querySelector('[name="label_text"]').addEventListener('input', updateTitleDisplay);

		/* 開閉ボタンのイベント */
		const toggleBtn = newItem.querySelector('.toggle_item_btn');
		const itemContent = newItem.querySelector('.item_content');
		toggleBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			newItem.classList.toggle('collapsed');
			toggleBtn.textContent = newItem.classList.contains('collapsed') ? '▶' : '▼';
		});

		updateItemArray();
	};

	/* ─────────────────────────────
	 * 初期描画
	 * ─────────────────────────── */
	item_arr_data.forEach(obj => addItem(obj));

	/* ─────────────────────────────
	 * select_pattern 変更
	 * ─────────────────────────── */
	itemsContainer.addEventListener('change', e => {
		if (e.target.name === 'select_pattern') {
			toggleOptionSection(e.target.closest('.form_item'));
			updateItemArray();
		}
	});

	/* ─────────────────────────────
	 * 削除／上下移動
	 * ─────────────────────────── */
	itemsContainer.addEventListener('click', e => {

		/* 削除 */
		if (e.target.closest('.delete_btn')) {
			if (confirm('削除しますがよろしいですか？')) {
				e.target.closest('.form_item').remove();
				updateItemArray();
			}
		}

		/* 上へ */
		if (e.target.closest('.move_up')) {
			const cur  = e.target.closest('.form_item');
			const prev = cur.previousElementSibling;
			if (prev) itemsContainer.insertBefore(cur, prev);
			updateItemArray();
		}

		/* 下へ */
		if (e.target.closest('.move_down')) {
			const cur  = e.target.closest('.form_item');
			const next = cur.nextElementSibling;
			if (next) itemsContainer.insertBefore(next, cur);
			updateItemArray();
		}
	});

	/* ─────────────────────────────
	 * 入力反映
	 * ─────────────────────────── */
	itemsContainer.addEventListener('input', updateItemArray);

	/* ─────────────────────────────
	 * ドラッグアンドドロップ機能
	 * ─────────────────────────── */
	let draggedItem = null;

	itemsContainer.addEventListener('dragstart', e => {
		if (e.target.classList.contains('form_item')) {
			draggedItem = e.target;
			e.target.classList.add('dragging');
			e.target.style.opacity = '0.5';
		}
	});

	itemsContainer.addEventListener('dragend', e => {
		if (e.target.classList.contains('form_item')) {
			e.target.classList.remove('dragging');
			e.target.style.opacity = '1';
			updateItemArray();
		}
	});

	itemsContainer.addEventListener('dragover', e => {
		e.preventDefault();
		const afterElement = getDragAfterElement(itemsContainer, e.clientY);
		if (afterElement == null) {
			itemsContainer.appendChild(draggedItem);
		} else {
			itemsContainer.insertBefore(draggedItem, afterElement);
		}
	});

	itemsContainer.addEventListener('drop', e => {
		e.preventDefault();
	});

	const getDragAfterElement = (container, y) => {
		const draggableElements = [...container.querySelectorAll('.form_item:not(.dragging)')];
		return draggableElements.reduce((closest, child) => {
			const box = child.getBoundingClientRect();
			const offset = y - box.top - box.height / 2;
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child };
			} else {
				return closest;
			}
		}, { offset: Number.NEGATIVE_INFINITY }).element;
	};

	/* ─────────────────────────────
	 * 追加ボタン
	 * ─────────────────────────── */
	addItemBtn?.addEventListener('click', () => addItem({}));

	/* ─────────────────────────────
	 * 全て開く / 全て閉じる ボタン
	 * ─────────────────────────── */
	const expandAllBtn = document.getElementById('expand_all_btn');
	const collapseAllBtn = document.getElementById('collapse_all_btn');

	expandAllBtn?.addEventListener('click', () => {
		const allItems = itemsContainer.querySelectorAll('.form_item');
		allItems.forEach(item => {
			item.classList.remove('collapsed');
			const toggleBtn = item.querySelector('.toggle_item_btn');
			if (toggleBtn) toggleBtn.textContent = '▼';
		});
	});

	collapseAllBtn?.addEventListener('click', () => {
		const allItems = itemsContainer.querySelectorAll('.form_item');
		allItems.forEach(item => {
			item.classList.add('collapsed');
			const toggleBtn = item.querySelector('.toggle_item_btn');
			if (toggleBtn) toggleBtn.textContent = '▶';
		});
	});

});
</script>

<style>
/* 全て開く/閉じるボタン */
.toggle_all_btns {
	display: flex;
	gap: 10px;
	margin-bottom: 15px !important;
}

.toggle_all_btn {
	padding: 8px 16px;
	background: #0073aa;
	color: #fff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 13px;
	transition: background 0.2s;
}

.toggle_all_btn:hover {
	background: #005a87;
}

/* アイテムヘッダー */
.form_item .item_header {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 15px;
	padding-left: 64px;
	background: #f7f7f7;
	border-radius: 2px 2px 0 0;
	cursor: pointer;
	user-select: none;
}
.form_item.collapsed .item_header {
	padding: 12px 15px;
}

.form_item .item_header .drag_handle {
	cursor: grab;
	flex-shrink: 0;
}

.form_item .item_header .drag_handle:active {
	cursor: grabbing;
}

.form_item .item_header .item_title_display {
	flex: 1;
	font-weight: 600;
	color: #333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.form_item .item_header .toggle_item_btn {
	flex-shrink: 0;
	font-size: 14px;
	color: #666;
	cursor: pointer;
	padding: 4px 8px;
	transition: transform 0.2s;
}

.form_item .item_header .toggle_item_btn:hover {
	color: #0073aa;
}

/* アイテムコンテンツ */
.form_item .item_content {
	max-height: 2000px;
	overflow: hidden;
	transition: max-height 0.3s ease, opacity 0.3s ease;
	opacity: 1;
}

.form_item.collapsed .item_content {
	max-height: 0;
	opacity: 0;
}

.form_item.collapsed .item_header {
	background: #fff;
	border-bottom: 2px solid #0073aa;
}

/* ドラッグ中のスタイル */
.form_item.dragging {
	opacity: 0.6;
	transform: rotate(2deg) scale(1.02);
	box-shadow: 0 8px 24px rgba(0,0,0,0.25);
	transition: none;
	cursor: grabbing !important;
}

.form_item {
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	margin-bottom: 15px;
}

.form_item .drag_handle {
	transition: opacity 0.2s;
}

.form_item:not(.collapsed) .item_content {
	margin-top: 0;
}
</style>
