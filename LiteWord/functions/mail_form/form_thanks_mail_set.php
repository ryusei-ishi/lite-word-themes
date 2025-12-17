<?php
if (!defined('ABSPATH')) exit;
$form_set_no = sanitize_text_field($args);
?>
<div class="none_plugin_message"></div>
<div class="lw_mail_form_wrap reset bg_color">
    <?=lw_mail_set_header("問合せフォーム $form_set_no 「サンクスメールの設定」")?>
    <?=lw_mail_set_tab_menu($form_set_no)?>
    <div class="lw_mail_send_thanks_wrap">
        <ul class="thanks_set_list">
            <li class="tab_1">1 セット目</li>
            <li class="tab_2">2 セット目</li>
            <li class="tab_3">3 セット目</li>
            <li class="tab_4">4 セット目</li>
            <li class="tab_5">5 セット目</li>
        </ul>
        <?php for ($i=1; $i <= 5; $i++):?>
            <div class="lw_mail_send_set hide">
                <form action="" method="post">
                    <dl>
                        <dt>ON / OFF</dt>
                        <dd>
                            <?=Lw_opt_select("form_send_thanks_{$i}_{$form_set_no}_switch",[
                            'on' => 'ON',
                            'off' => 'OFF'
                            ])?>
                            <p>サンクスメールの送信を有効にするかどうかを設定します。</p>
                        <dt>件名</dt>
                        <dd>
                            <?=Lw_opt_text("form_send_thanks_{$i}_{$form_set_no}_subject","text","","","","[your_name]様 お問合わせありがとうございます。")?>
                            <p>メールの件名として設定され、受信者が受け取る際に表示されます。</p>
                        </dd>
                        <dt>送信先メールアドレス</dt>
                        <dd>
                            <?=Lw_opt_text("form_send_thanks_{$i}_{$form_set_no}_to_mail","text","","","","[your_mail]")?>
                            <p>
                                ショートコードをご入力ください。<br>
                                例）[your_mail] <br>
                            </p>
                        </dd>
                        <dt>送信元会社名 or お名前</dt>
                        <dd>
                            <?=Lw_opt_text("form_send_thanks_{$i}_{$form_set_no}_from_name","text","","","",get_bloginfo('name')." 担当者")?>
                            <p>
                                送信者の名前または会社名として、受信者に表示されます。
                                <br>例）<?= get_bloginfo('name') ?>担当者
                            </p>
                        </dd>
                        <dt>送信元メールアドレス</dt>
                        <dd>
                            <?=Lw_opt_text("form_send_thanks_{$i}_{$form_set_no}_from_mail","text","","","","info@".parse_url(home_url(), PHP_URL_HOST))?>
                            <p>
                                送信者のメールアドレスとして設定され、受信者が返信する際の宛先になります。<br>
                                例）info@<?= parse_url(home_url(), PHP_URL_HOST) ?><br>
                                送信元がドメインと一致しない場合、迷惑メールとして扱われる可能性がありますのでご注意ください。
                            </p>
                        </dd>
                        <dt>本文</dt>
                        <dd>
                            <?=Lw_opt_text("form_send_thanks_{$i}_{$form_set_no}_body","textarea","","","10","[your_name] 様\n".get_bloginfo('name')."にお問い合わせいただきありがとうございます。\n担当より通常 2〜3 営業日以内にご返信いたします。\n\n※ 本メールは自動送信です。\n内容に心当たりがない場合は破棄していただければ幸いです。\n\n")?>
                            <p>
                                送信者に送信されるメールの本文を設定します。
                            </p>
                        </dd>
                        <input style="grid-column: span 2;" type="submit" value="変更内容を保存する" class="Lw_mail_setting_form_submit">
                    </dl>
                </form>
            </div>
        
        <?php endfor;?>
    </div>
</div>
<style>
    .save_btn_wrap{
        display: none;
    }
</style>
<script>
document.addEventListener('DOMContentLoaded', () => {
	/* -----------------------------
	 * 要素取得
	 * --------------------------- */
	const tabs   = Array.from(document.querySelectorAll('.thanks_set_list li'));
	const panels = Array.from(document.querySelectorAll('.lw_mail_send_set'));

	if (!tabs.length || !panels.length) return;

	/* -----------------------------
	 * タブ切り替え
	 * --------------------------- */
	const activate = (idx) => {
		tabs.forEach((li, i)    => li.classList.toggle('on',  i === idx));
		panels.forEach((div, i) => div.classList.toggle('on', i === idx));
	};

	/* -----------------------------
	 * ON / OFF 監視 → .active_thanks 付与
	 * --------------------------- */
	const refreshActiveFlags = () => {
		panels.forEach((panel, i) => {
			const sel = panel.querySelector('select[name$="_switch"]');
			if (sel && sel.value === 'on') {
				tabs[i].classList.add('active_thanks');
			} else {
				tabs[i].classList.remove('active_thanks');
			}
		});
	};

	/* 初期化：1 番目をアクティブ、ON 状態を反映 */
	activate(0);
	refreshActiveFlags();

	/* タブクリック */
	tabs.forEach((li, idx) => {
		li.addEventListener('click', () => activate(idx));
	});

	/* ON / OFF が変わったらフラグ更新 */
	panels.forEach(panel => {
		const sel = panel.querySelector('select[name$="_switch"]');
		if (sel) sel.addEventListener('change', refreshActiveFlags);
	});
});
</script>
