/*  send.js  |  フロント側 Ajax 送信 + reCAPTCHA + 画像対応
   ------------------------------------------------------------
   - <form class="lw_mail_form"> ごとに FormData をそのまま送信
   - multipart/form-data は fetch に FormData を渡せば自動付与される
   - 画像／ファイルも一緒に送れる
   - reCAPTCHA V3 が有効な時はトークンを FormData に append
   - 戻り値：{ success:true|false, data:{ message:"…" } }
   - GTM/GA4 コンバージョン計測用カスタムイベント対応
---------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
	/* 対象フォームを取得 */
	const forms = document.querySelectorAll('.lw_mail_form');
	if (!forms.length) return;

	forms.forEach(form => {
		form.addEventListener('submit', e => {
			e.preventDefault();               // ページ遷移を防止
			const resultBox = form.querySelector('.lw_mail_result');
			if (resultBox) resultBox.textContent = '送信中…';

			/* ------- FormData を構築 ------- */
			const fd = new FormData(form);                 // 既存 input は全部入る（画像含む）
			const postId = fd.get('lw_current_post_id') || '';
			const formSetNo = fd.get('lw_mail_form_set_no') || '';  // フォームセット番号を取得（GTM用）
			fd.delete('lw_current_post_id');               // 中身は別名で送る
			fd.set('action',                'lw_mail_form_submit');
			fd.set('nonce',                 lw_mail_form.nonce);      // wp_localize_script で渡している想定
			fd.set('lw_current_post_id',    postId);                  // PHP 側が拾いやすいよう改めて付与

			/* ------- reCAPTCHA が有効なら先に取得 ------- */
			const execSubmit = () => {
				fetch(lw_mail_form.ajax_url, {
					method : 'POST',
					body   : fd                                    // Content-Type は自動
				})
					.then(r => r.json())
					.then(data => {
						if (!resultBox) return;
						if (data.success) {
							resultBox.innerHTML = `<p style="color:#007c05">${data.data.message}</p>`;
							form.reset();
							/* プレビュー画像があれば消す */
							form.querySelectorAll('.lw_preview_box img').forEach(img => img.style.display = 'none');
							
							/* ========================================
							 * GTM/GA4 コンバージョン計測用イベント発火
							 * ======================================== */
							try {
								// 1) CustomEvent を発火（addEventListener で拾える）
								const customEvent = new CustomEvent('litewordFormSubmit', {
									detail: {
										formSetNo: formSetNo,
										postId: postId,
										form: form
									},
									bubbles: true,
									cancelable: true
								});
								document.dispatchEvent(customEvent);
								
								// 2) dataLayer へ直接プッシュ（GTM が読み込まれている場合）
								if (typeof window.dataLayer !== 'undefined') {
									window.dataLayer.push({
										'event': 'litewordFormSubmit',
										'formSetNo': formSetNo,
										'postId': postId
									});
								}
							} catch (eventError) {
								// イベント発火エラーは送信成功を妨げないよう console のみ
								console.warn('GTM event dispatch error:', eventError);
							}
							
						} else {
							resultBox.innerHTML = `<p style="color:#d63638">${data.data.message}</p>`;
						}
					})
					.catch(err => {
						console.error(err);
						if (resultBox) resultBox.innerHTML = '<p style="color:#d63638">送信エラーが発生しました。</p>';
					});
			};

			/* ▼ reCAPTCHA スイッチ判定（PHP → js へ wp_localize_script 済み想定） */
			if (typeof lw_mail_form !== 'undefined' && lw_mail_form.recaptcha_site_key) {
				grecaptcha.ready(() => {
					grecaptcha.execute(lw_mail_form.recaptcha_site_key, { action:'submit' })
						.then(token => {
							fd.set('g-recaptcha-response', token);
							execSubmit();
						})
						.catch(ex => {
							console.error('reCAPTCHA error', ex);
							execSubmit();   // 失敗しても一応送る
						});
				});
			} else {
				execSubmit();               // reCAPTCHA 無効
			}
		});
	});

	/* 画像プレビュー（form_put.php 側と同じロジックを JS 別ファイル化） */
	document.querySelectorAll('.lw_mail_form .lw_image_input').forEach(inp => {
		inp.addEventListener('change', e => {
			const f   = e.target.files?.[0];
			const img = e.target.closest('.image_field_wrap')?.querySelector('.lw_preview_box img');
			if (!img) return;
			if (f && f.type.startsWith('image/')) {
				const url = URL.createObjectURL(f);
				img.src = url;
				img.style.display = 'block';
				img.onload = () => URL.revokeObjectURL(url);
			} else {
				img.src = '';
				img.style.display = 'none';
			}
		});
	});
});