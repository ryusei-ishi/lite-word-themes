<?php
if (!defined('ABSPATH')) exit;
// LiteWord専用 問合せフォームの制作
function Lw_mail_form_opt_input_text($name,$id="", $class="", $placeholder="", $df_value="") {
    if (!is_admin()) return;
    $set_value = get_option($name);
    if (empty($set_value) && !empty($df_value)) {
        $set_value = $df_value;
    }
    echo "<textarea class='".esc_attr($class)."' id='".esc_attr($id)."' name='".esc_attr($name)."' placeholder='".esc_attr($placeholder)."'>".esc_textarea($set_value)."</textarea>";
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'lw_mail_form_memo') {
    // nonceチェック
    if (wp_verify_nonce($_POST['lw_mail_form_memo_nonce'], 'lw_mail_form_memo_nonce')) {
        $form_id = intval($_POST['form_id']);
        // ⭐ ここを変更：sanitize_text_field を sanitize_textarea_field に変更
        $memo_value = sanitize_textarea_field($_POST['lw_mail_form_memo_' . $form_id]);
        
        // オプションを更新
        update_option('lw_mail_form_memo_' . $form_id, $memo_value);
        
        // 成功メッセージ（オプション）
        echo '<div class="notice notice-success"><p>メモを保存しました。</p></div>';
    } else {
        echo '<div class="notice notice-error"><p>セキュリティチェックに失敗しました。</p></div>';
    }
}
?>
<div class="none_plugin_message"></div>
<div class="lw_mail_form_set_wrap reset">
<?=lw_mail_set_header("LiteWord専用 問合せフォームの制作", "link" , "解説動画" , admin_url()."admin.php?page=lw-manual-viewer&manual_page=contact-form" ,"")?>
    <ul class="lw_mail_form_list">
        <?php 
            $form_no = 10;
            if(LW_HAS_SUBSCRIPTION == true){
                $form_no = 40;
            }
            for ($i=1; $i <=$form_no ; $i++): 
        ?>
            <li>
                <div class="text">フォーム <?=$i?></div>
                <div class="switch_form">
                    <?php 
                        // フォームの状態を取得（デフォルトはon）
                        $form_status = get_option('lw_mail_form_status_' . $i, 'on');
                        $is_checked = ($form_status === 'on') ? 'checked' : '';
                    ?>
                    <div class="lw-form-toggle-wrapper">
                        <label class="lw-form-toggle">
                            <input type="checkbox" 
                                class="lw-form-toggle-checkbox" 
                                data-form-id="<?php echo $i; ?>"
                                <?php echo $is_checked; ?>>
                            <span class="lw-form-toggle-slider"></span>
                        </label>
                        <span class="lw-form-toggle-status <?php echo $form_status; ?>">
                            <?php echo ($form_status === 'on') ? '有効' : '無効'; ?>
                        </span>
                    </div>
                </div>
                <a href="<?=admin_url()?>admin.php?page=lw_mail_form_set&form_set=<?=$i?>">フォームを設定する</a>
                <?php if(LW_EXPANSION_BASE): ?>
                    <a href="<?=admin_url()?>admin.php?page=lw_mail_form_set&form_reception_history_list=<?=$i?>">受信履歴</a>
                <?php endif; ?>
                <?php if(LW_HAS_SUBSCRIPTION == true):?>
                <div class="memo">
                    <form action="" method="post">
                        <?php 
                            Lw_mail_form_opt_input_text("lw_mail_form_memo_".$i, "lw_mail_form_memo_".$i, "lw_mail_form_memo", "このフォームのメモを入力できます。");
                        ?>
                        <input type="hidden" name="action" value="lw_mail_form_memo">
                        <input type="hidden" name="form_id" value="<?=$i?>">
                        <?php wp_nonce_field('lw_mail_form_memo_nonce','lw_mail_form_memo_nonce'); ?>
                        <input type="submit" class="button" value="保存">
                    </form>
                </div>
                <?php endif; ?>
                <div class="short_code copyable" data-code="[lw_mail_form_select id='<?=$i?>']">
                    [lw_mail_form_select id="<?=$i?>"]
                </div>
            </li>
        <?php endfor; ?>
    </ul>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".short_code.copyable").forEach(function(element) {
        element.addEventListener("click", function() {
            // データ属性からコピーするテキストを取得
            let text = this.getAttribute("data-code");
            
            // 一時的なテキストエリアを作成
            let tempInput = document.createElement("textarea");
            tempInput.value = text;
            document.body.appendChild(tempInput);
            
            // 選択してコピー
            tempInput.select();
            document.execCommand("copy");
            
            // 一時的な要素を削除
            document.body.removeChild(tempInput);

            // コピー完了のフィードバック
            alert("コピーしました: " + text);
        });
    });
});
// トグルスイッチのイベントリスナー
// トグルボタンの処理
document.querySelectorAll(".lw-form-toggle-checkbox").forEach(function(toggle) {
    toggle.addEventListener("change", function() {
        const formId = this.getAttribute("data-form-id");
        const isChecked = this.checked;
        const wrapper = this.closest(".lw-form-toggle-wrapper");
        const statusText = wrapper.querySelector(".lw-form-toggle-status");
        
        // 保存中の表示
        wrapper.classList.add("saving");
        
        // Ajaxリクエスト
        const formData = new FormData();
        formData.append("action", "lw_toggle_form_status");
        formData.append("form_id", formId);
        formData.append("status", isChecked ? "on" : "off");
        formData.append("nonce", "<?php echo wp_create_nonce('lw_toggle_form_nonce'); ?>");
        
        fetch("<?php echo admin_url('admin-ajax.php'); ?>", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // 保存中の表示を削除
            wrapper.classList.remove("saving");
            
            if (data.success) {
                // ステータステキストを更新
                if (isChecked) {
                    statusText.textContent = "有効";
                    statusText.classList.remove("off");
                    statusText.classList.add("on");
                } else {
                    statusText.textContent = "無効";
                    statusText.classList.remove("on");
                    statusText.classList.add("off");
                }
            } else {
                // エラー時は元に戻す
                toggle.checked = !isChecked;
                alert("保存に失敗しました: " + (data.message || "不明なエラー"));
            }
        })
        .catch(error => {
            wrapper.classList.remove("saving");
            toggle.checked = !isChecked;
            alert("通信エラーが発生しました");
            console.error("Error:", error);
        });
    });
});
</script>
