<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/*--------------------------------------------------------------
  ショートコード : [lw_mail_form_select id="◯◯"]
--------------------------------------------------------------*/
function lw_mail_form_select_shortcode( $atts ) {

	$atts        = shortcode_atts( [ 'id' => '' ], $atts );
	$form_set_no = sanitize_text_field( $atts['id'] );

	if ( ! $form_set_no ) {
		return '<p>フォームセットのIDが指定されていません。</p>';
	}

	// ---------- フォームデータ取得 ----------
	$form_data = get_option( "lw_mail_form_set_{$form_set_no}", [] );

	// 保存形式が配列 or JSON か判定
	if ( is_string( $form_data ) ) {
		$form_data = json_decode( $form_data, true );
	}

	// データベースにデータがない場合はデフォルト値を使用
	if ( ! is_array( $form_data ) || empty( $form_data ) ) {
		$form_data = [
			[
				'select_pattern'  => 'name',
				'required'        => true,
				'label_text'      => 'お名前',
				'option'          => "オプションテキスト1\nオプションテキスト2\nオプションテキスト3",
				'supplement_text' => '例）山田太郎',
				'placeholder'     => '',
				'shortcode'       => 'your_name',
			],
			[
				'select_pattern'  => 'email',
				'required'        => true,
				'label_text'      => 'メールアドレス',
				'option'          => "オプションテキスト1\nオプションテキスト2\nオプションテキスト3",
				'supplement_text' => '例）sample@gmail.com',
				'placeholder'     => '',
				'shortcode'       => 'your_mail',
			],
			[
				'select_pattern'  => 'textarea',
				'required'        => false,
				'label_text'      => 'お問合せ内容',
				'option'          => "オプションテキスト1\nオプションテキスト2\nオプションテキスト3",
				'supplement_text' => '',
				'placeholder'     => '',
				'shortcode'       => 'your_message',
			],
		];
	}

	/* ★★ reCAPTCHA をここで確実に登録する ★★
	   -------------------------------------------------- */
	// LINEブラウザでない場合のみreCAPTCHAを有効化
	if ( can_use_recaptcha() ) {

		$site_key = get_option( 'lw_form_recaptcha_site_key', '' );

		if ( $site_key ) {
			$handle = "lw-recaptcha-v3-{$form_set_no}";

			// 外部 js
			wp_enqueue_script(
				$handle,
				'https://www.google.com/recaptcha/api.js?render=' . $site_key,
				[],
				null,
				true
			);

			// hidden input 挿入用インライン js
			wp_add_inline_script( $handle, "
				document.addEventListener('DOMContentLoaded', function() {
					if (typeof grecaptcha === 'undefined') return;

					grecaptcha.ready(function() {
						grecaptcha.execute('{$site_key}', {action: 'submit'})
							.then(function(token) {
								document.querySelectorAll('form.lw_mail_form').forEach(function(form) {
									var input       = document.createElement('input');
									input.type      = 'hidden';
									input.name      = 'g-recaptcha-response';
									input.value     = token;
									form.appendChild(input);
								});
							});
					});
				});
			", 'after' );
		}
	}
	/* ---------- ここまで reCAPTCHA ---------- */

	return lw_render_mail_form( $form_data, $form_set_no );  // フォームHTML
}
add_shortcode( 'lw_mail_form_select', 'lw_mail_form_select_shortcode' );



// フォームのHTMLを生成
function lw_render_mail_form($form_data, $form_set_no) {
    ob_start(); // 出力バッファリング開始
	// フォームの状態をチェック
	$is_form_enabled = lw_is_form_enabled($form_set_no);

	// 無効な場合の通知メッセージ
	if (!$is_form_enabled) {
		?>
		<div class="lw-form-disabled-notice" style="
			margin: 20px 0;
			background: #fff3cd;
			border: 1px solid #ffc107;
			color: #856404;
			padding: 12px 15px;
			margin-bottom: 20px;
			border-radius: 4px;
			font-size: 14px;
		">
			<strong>ご注意：</strong> 現在、このフォームは一時的にご利用いただけません。
		</div>
		<?php
	}
    //cssの読み込み
    wp_enqueue_style('Lw_put_form_style_ptn_1', get_template_directory_uri() . '/functions/mail_form/put_style/ptn_1.css', array(), css_version(), 'all');
    $form_id = 'lw_mail_form_' . $form_set_no;
    $current_post_id = get_the_ID() ?: 0; 
    ?>
    <form class="lw_mail_form" id="<?=$form_id?>" enctype="multipart/form-data" method="post">
        <?php wp_nonce_field('lw_mail_form_nonce', 'lw_mail_nonce'); ?>
        <input type="hidden" name="lw_mail_form_set_no" value="<?php echo esc_attr($form_set_no); ?>">
        <input type="hidden" name="lw_current_post_id" value="<?= $current_post_id?>">
        <?php 
        $last_key = array_key_last($form_data); // 最後のキーを取得

        
/* ----------------------------------------------------------
 *  ┃ ここから foreach ループ ┃
 * ----------------------------------------------------------*/
foreach ( $form_data as $idx => $field ) :

	/* ── 値の取得＆下準備 ───────────────────────── */
	$pattern         = isset( $field['select_pattern'] ) ? esc_attr( $field['select_pattern'] ) : '';
	if ( $pattern === '' ) continue;                                   // 未選択はスキップ

	$label           = isset( $field['label_text'] )     ? esc_html( $field['label_text'] ) : '';
	$required        = ! empty( $field['required'] );
	$req_attr        = $required ? 'required' : '';
	$supplement      = isset( $field['supplement_text'] )? esc_html( $field['supplement_text'] ) : '';
	$placeholder     = isset( $field['placeholder'] )    ? esc_attr( $field['placeholder'] ) : '';
	$name_base       = 'form_' . ( $idx + 1 );                           // form_1 / form_2 …
	$shortcode_attr  = ! empty( $field['shortcode'] )
	                   ? ' data-shot-code="' . esc_attr( $field['shortcode'] ) . '"'
	                   : '';

	/* チェックボックス / ラジオ / セレクトの候補 ------------ */
	$opt_raw   = isset( $field['option'] ) ? html_entity_decode( $field['option'] ) : '';
	$opt_lines = $opt_raw !== '' ? array_map( 'trim', explode( "\n", $opt_raw ) ) : [];

	/* 最後の行フラグ（デザイン用） --------------------------- */
	$last_cls = ( $idx === array_key_last( $form_data ) ) ? ' last_form' : '';

?>
<div class="form_group<?= $last_cls; ?>"<?= $shortcode_attr; ?>>
	<div class="label_in">
		<label>
			<span class="text"><?= brSt($label); ?></span>
			<span class="required <?= $required ? 'is-required' : 'is-optional'; ?>">
				<?= $required ? '必須' : '任意'; ?>
			</span>
		</label>
	</div>

	<div class="form_in">

	<?php /* ───────── １行テキスト系 ───────── */ ?>
	<?php if ( in_array( $pattern, [ 'text','name','email','phone' ], true ) ) : ?>
		<input type="text"
		       name="<?= esc_attr( $name_base ); ?>"
		       placeholder="<?= $placeholder; ?>"
		       <?= $req_attr; ?> >
    <?php /* ───────── 日付入力 (date) ────────── */ ?>
    <?php elseif ( $pattern === 'date' ) : ?>
        <input type="date"
               name="<?= esc_attr( $name_base ); ?>"
               <?= $req_attr; ?> >

    <?php /* ───────── 時刻入力 (time) ────────── */ ?>
    <?php elseif ( $pattern === 'time' ) : ?>
        <input type="time"
               name="<?= esc_attr( $name_base ); ?>"
               <?= $req_attr; ?> >

	<?php /* ───────── テキストエリア ────────── */ ?>
	<?php elseif ( $pattern === 'textarea' ) : ?>
		<textarea name="<?= esc_attr( $name_base ); ?>"
		          placeholder="<?= $placeholder; ?>"
		          <?= $req_attr; ?>></textarea>

	<?php /* ───────── セレクトボックス ───────── */ ?>
	<?php elseif ( $pattern === 'select' && $opt_lines ) : ?>
		<select name="<?= esc_attr( $name_base ); ?>" <?= $req_attr; ?>>
			<?php foreach ( $opt_lines as $opt ) : ?>
				<option value="<?= esc_attr( $opt ); ?>"><?= esc_html( $opt ); ?></option>
			<?php endforeach; ?>
		</select>

	<?php /* ───────── ラジオボタン ─────────── */ ?>
	<?php elseif ( $pattern === 'radio' && $opt_lines ) : ?>
		<div class="radio_in">
			<?php foreach ( $opt_lines as $opt ) : ?>
				<label>
					<input type="radio"
					       name="<?= esc_attr( $name_base ); ?>"
					       value="<?= esc_attr( $opt ); ?>"
					       <?= $req_attr; ?> >
					<?= esc_html( $opt ); ?>
				</label>
			<?php endforeach; ?>
		</div>

	<?php /* ───────── チェックボックス ───────── */ ?>
	<?php elseif ( $pattern === 'checkbox' && $opt_lines ) : ?>
		<div class="checkbox_in">
			<?php foreach ( $opt_lines as $idx_cb => $opt ) : ?>
				<label>
					<input type="checkbox"
					       name="<?= esc_attr( $name_base ); ?>[]"
					       value="<?= esc_attr( $opt ); ?>"
					       <?= ( $required && $idx_cb === 0 ) ? 'required' : ''; ?> >
					<?= esc_html( $opt ); ?>
				</label>
			<?php endforeach; ?>
		</div>

	<?php /* ───────── 画像アップロード ───────── */ ?>
	<?php elseif ( $pattern === 'image' ) : ?>
		<div class="image_field_wrap">
			<div class="lw_preview_box" style="margin-bottom:8px;">
				<img src="" alt="preview"
				     style="max-width:480px;width:100%;display:none;">
			</div>
			<input type="file"
			       class="lw_image_input"
			       name="<?= esc_attr( $name_base ); ?>"
			       accept=".jpg,.jpeg,.png,.gif,image/*"
			       <?= $req_attr; ?> >

			
		</div>

	<?php endif; /* pattern switch */ ?>

		<?php if ( $supplement !== '' ) : ?>
			<p class="supplement_text"><?= brSt( $supplement ); ?></p>
		<?php endif; ?>

	</div>

	<!-- /.form_in -->
</div><!-- /.form_group -->
<?php endforeach; ?>


        <?php 
            // 同意部分の表示
            $consent_switch = get_option("form_consent_set_{$form_set_no}_switch");
            if ($consent_switch == "on"): 
                $consent_url = get_option("form_consent_set_{$form_set_no}_url");
                if(empty($consent_url)){
                    $consent_url = home_url()."/privacy-policy";
                }
                $consent_text = get_option("form_consent_set_{$form_set_no}_p");
                $consent_label = get_option("form_consent_set_{$form_set_no}_label");
                if(empty($consent_label)){
                    $consent_label = "プライバシーポリシー";
                }
                $consent_type = get_option("form_consent_set_{$form_set_no}_type");
                if ($consent_type !== "type_text" || empty($consent_text)) {
                    $consent_checkbox_position = "center";
                }else{
                    $consent_checkbox_position = "left";
                }
           
        ?>
            <div class="consent_set">
                <?php 
                    if (!empty($consent_text) && $consent_type === 'type_text'):
                        $consent_text = wpautop($consent_text); // 改行を適切に処理
                ?>
                    <div class="consent_text_wrap">
                        <div class="consent_text_inner post_style">
                            <div class="first_content"></div>
                            <?= $consent_text ?>
                        </div>
                    </div>
                <?php endif; ?>
                <div class="consent_check_wrap <?=$consent_checkbox_position?>">
                    <?php
                        if($consent_type !== "type_text"):
                    ?>
                    <p><a href="<?=$consent_url?>" <?=new_tab()?>><?=$consent_label?></a>についてご同意の上、お問い合わせください。</p>
                    <?php endif; ?>
                    <label for="lw_consent_<?=$form_set_no?>">
                        <input type="checkbox" id="lw_consent_<?=$form_set_no?>" value="1" required>
                        <span><?=$consent_label?>に同意する</span>
                    </label>
                </div>
            </div>
        <?php endif; ?>
        <?php 
            $subject_button_text = get_option("form_send_set_{$form_set_no}_subject_button");
            if(empty($subject_button_text)){
                $subject_button_text = "送信する";
            }
        ?>
        <div class="submit_wrap">
			<button type="submit" <?php echo !$is_form_enabled ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''; ?>>
				<span class="text"><?=$subject_button_text?></span>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
			</button>
		</div>
        <div class="lw_mail_result"></div>
    </form>
    <?php 
		// サンクスページの設定がある場合はリダイレクト
		$thanks_url = get_option("form_thanks_page_set_{$form_set_no}_thanks_page_url", '');
		if (!empty($thanks_url)): ?>
		<script>
			document.addEventListener('DOMContentLoaded', function () {
				const resultContainer = document.querySelector('#<?= esc_js($form_id); ?> .lw_mail_result');
				if (!resultContainer) return;

				// ポップアップを移動する関数
				function movePopupToBody() {
					const popup = resultContainer.querySelector(".lw_mail_send_completion_popup");
					if (popup && popup.parentElement !== document.body) {
						document.body.appendChild(popup);
						
						// 2秒後にリダイレクト
						setTimeout(function () {
							window.location.href = '<?php echo esc_js($thanks_url); ?>';
						}, 2000);
						
						return true;
					}
					return false;
				}

				// 既に存在する場合の処理
				if (movePopupToBody()) return;

				// 後から追加される場合の監視
				const observer = new MutationObserver(function (mutationsList) {
					if (movePopupToBody()) {
						observer.disconnect();
					}
				});

				observer.observe(resultContainer, {
					childList: true,
					subtree: true
				});
			});
		</script>
	<?php else: ?>
		<!-- サンクスページの設定がない場合でもポップアップを移動 -->
		<script>
			document.addEventListener('DOMContentLoaded', function () {
				const resultContainer = document.querySelector('#<?= esc_js($form_id); ?> .lw_mail_result');
				if (!resultContainer) return;

				// ポップアップを移動する関数
				function movePopupToBody() {
					const popup = resultContainer.querySelector(".lw_mail_send_completion_popup");
					if (popup && popup.parentElement !== document.body) {
						document.body.appendChild(popup);
						return true;
					}
					return false;
				}

				// 既に存在する場合の処理
				if (movePopupToBody()) return;

				// 後から追加される場合の監視
				const observer = new MutationObserver(function (mutationsList) {
					if (movePopupToBody()) {
						observer.disconnect();
					}
				});

				observer.observe(resultContainer, {
					childList: true,
					subtree: true
				});
			});
		</script>
	<?php endif; ?>
    <?php 
        // reCAPTCHAの表記の有無
        $lw_recaptcha_display = get_option("lw_recaptcha_display", '');
        if ($lw_recaptcha_display == "off"): ?>
       <style>
        .grecaptcha-badge {
            visibility: hidden;
        }
       </style>
    <?php endif; ?>
	<script>
	document.addEventListener('DOMContentLoaded', function () {
		const form = document.getElementById('<?= esc_js( $form_id ); ?>');
		if (!form) return;

		// required が付いたチェックボックスの name を収集
		const requiredNames = Array.from(
			form.querySelectorAll('input[type="checkbox"][required]')
		).map(cb => cb.name);

		// 重複除去
		const uniqueNames = Array.from(new Set(requiredNames));

		uniqueNames.forEach(name => {
			const cbs = form.querySelectorAll('input[type="checkbox"][name="' + name + '"]');

			// ★ チェックボックスが見つからない場合はスキップ
   			 if (cbs.length === 0) return;
			const toggleRequired = () => {
				const anyChecked = Array.from(cbs).some(cb => cb.checked);
				if (anyChecked) {
					cbs.forEach(cb => cb.removeAttribute('required'));
				} else {
					cbs[0].setAttribute('required', 'required');
				}
			};

			// 変更イベント
			cbs.forEach(cb => cb.addEventListener('change', toggleRequired));

			// 初期状態
			toggleRequired();
		});
	});
	</script>
	<script>
		document.addEventListener('DOMContentLoaded', () => {

			/* 画像プレビュー ----------------------------- */
			document.querySelectorAll('.lw_mail_form .lw_image_input').forEach(input => {
				input.addEventListener('change', e => {
					const file   = e.target.files?.[0];
					const box    = e.target.closest('.image_field_wrap')?.querySelector('.lw_preview_box img');
					if (!box) return;

					if (file && file.type.startsWith('image/')) {
						/* Object-URL で即時プレビュー */
						const url = URL.createObjectURL(file);
						box.src          = url;
						box.style.display= 'block';

						/* メモリリーク防止：次回読み込み時に revoke */
						box.onload = () => URL.revokeObjectURL(url);
					} else {
						/* 画像ではない or 未選択 ⇒ 非表示に戻す */
						box.src = '';
						box.style.display = 'none';
					}
				});
			});

		});
	</script>

    <?php
    return ob_get_clean(); // バッファリングしたHTMLを返す
}